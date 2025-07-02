import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewTagService } from './review-tag.service';
import { CreateReviewTagDto } from './dto/create-review-tag.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../../common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Review Tags')
@Controller('review-tags')
export class ReviewTagController {
  constructor(private readonly service: ReviewTagService) {}

  @ApiOperation({ summary: 'Lấy tất cả thẻ đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách thẻ đánh giá trả về thành công',
  })
  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo thẻ đánh giá (chỉ admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thẻ thành công' })
  @ApiResponse({ status: 403, description: 'Chỉ admin mới được phép tạo' })
  async create(@Body() dto: CreateReviewTagDto, @Req() req: AuthRequest) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create review tags');
    }
    return this.service.create(dto);
  }
}
