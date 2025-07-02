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

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto, @Req() req: AuthRequest) {
    return this.service.create(req.user.user_id, dto);
  }

  @Get()
  async getReviews(
    @Query('target_type') target_type: 'product' | 'restaurant',
    @Query('target_id') target_id: string
  ) {
    return this.service.findByTarget(target_type, target_id);
  }
}
