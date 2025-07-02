import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AddonService } from './addon.service';
import { CreateAddonDto } from './dto/create-addon.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.request';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Addons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addons')
export class AddonController {
  constructor(private readonly service: AddonService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo addon mới' })
  @ApiResponse({ status: 201, description: 'Tạo addon thành công' })
  @ApiResponse({ status: 400, description: 'Không có quyền tạo addon' })
  async create(@Body() dto: CreateAddonDto, @Req() req: AuthRequest) {
    const { user_id, role } = req.user;

    if (role !== 'admin') {
      const isOwner = await this.service.checkRestaurantOwnership(
        user_id,
        dto.restaurant_id
      );
      if (!isOwner) {
        throw new BadRequestException(
          'Bạn không có quyền thêm addon cho nhà hàng này'
        );
      }
    }

    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách addon bởi quán ăn' })
  @ApiQuery({
    name: 'restaurant_id',
    required: true,
    description: 'ID của nhà hàng',
  })
  @ApiResponse({ status: 200, description: 'Danh sách addon của nhà hàng' })
  async getByRestaurant(@Query('restaurant_id') restaurant_id: string) {
    if (!restaurant_id) {
      throw new BadRequestException('restaurant_id là bắt buộc');
    }
    return this.service.findByRestaurant(restaurant_id);
  }
}
