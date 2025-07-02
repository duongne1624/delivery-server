import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewTag } from './review-tag.interface';
import { CreateReviewTagDto } from './dto/create-review-tag.dto';

@Injectable()
export class ReviewTagService {
  constructor(
    @InjectModel('ReviewTag') private readonly model: Model<ReviewTag>
  ) {}

  async findAll(): Promise<ReviewTag[]> {
    return this.model.find().sort({ created_at: -1 }).exec();
  }

  async create(dto: CreateReviewTagDto): Promise<ReviewTag> {
    const tag: ReviewTag = {
      ...dto,
      is_active: dto.is_active ?? true,
      created_at: new Date(),
    };
    return this.model.create(tag);
  }
}
