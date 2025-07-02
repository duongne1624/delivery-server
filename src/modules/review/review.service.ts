import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './review.interface';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private readonly model: Model<Review>) {}

  async create(user_id: string, dto: CreateReviewDto): Promise<Review> {
    return this.model.create({
      ...dto,
      user_id,
      created_at: new Date(),
    });
  }

  async findByTarget(
    target_type: 'product' | 'restaurant',
    target_id: string
  ): Promise<Review[]> {
    return this.model.find({ target_type, target_id }).exec();
  }
}
