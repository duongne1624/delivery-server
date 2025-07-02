import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.request';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đánh giá mới' })
  @ApiBody({ type: CreateReviewDto })
  async create(@Body() dto: CreateReviewDto, @Req() req: AuthRequest) {
    return this.service.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đánh giá theo đối tượng' })
  @ApiQuery({
    name: 'target_type',
    enum: ['product', 'restaurant'],
    required: true,
    description: 'Loại đối tượng được đánh giá',
  })
  @ApiQuery({
    name: 'target_id',
    required: true,
    description: 'ID của đối tượng được đánh giá',
  })
  async getReviews(
    @Query('target_type') target_type: 'product' | 'restaurant',
    @Query('target_id') target_id: string
  ) {
    return this.service.findByTarget(target_type, target_id);
  }
}
