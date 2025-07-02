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

@UseGuards(JwtAuthGuard)
@Controller('addons')
export class AddonController {
  constructor(private readonly service: AddonService) {}

  @Post()
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
  async getByRestaurant(@Query('restaurant_id') restaurant_id: string) {
    return this.service.findByRestaurant(restaurant_id);
  }
}
