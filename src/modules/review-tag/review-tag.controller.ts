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

@Controller('review-tags')
export class ReviewTagController {
  constructor(private readonly service: ReviewTagService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReviewTagDto, @Req() req: AuthRequest) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create review tags');
    }
    return this.service.create(dto);
  }
}
