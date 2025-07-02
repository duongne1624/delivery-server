import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewTagSchema } from './review-tag.schema';
import { ReviewTagService } from './review-tag.service';
import { ReviewTagController } from './review-tag.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ReviewTag', schema: ReviewTagSchema }]),
  ],
  providers: [ReviewTagService],
  controllers: [ReviewTagController],
  exports: [MongooseModule],
})
export class ReviewTagModule {}
