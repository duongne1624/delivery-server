import {
  IsString,
  IsIn,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    enum: ['product', 'restaurant'],
    description: 'Loại mục được đánh giá',
    example: 'restaurant',
  })
  @IsIn(['product', 'restaurant'])
  target_type: 'product' | 'restaurant';

  @ApiProperty({
    description: 'ID của đối tượng được đánh giá',
    example: '64c96f9b5b0e6a0013c457a3',
  })
  @IsString()
  target_id: string;

  @ApiProperty({
    description: 'Số sao đánh giá (1 đến 5)',
    example: 4,
  })
  @IsNumber()
  rating: number;

  @ApiPropertyOptional({
    description: 'Bình luận đánh giá (tuỳ chọn)',
    example: 'Món ăn rất ngon và phục vụ nhanh.',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    description: 'Danh sách tag review (tối đa 5)',
    example: ['ngon', 'giá rẻ'],
    maxItems: 5,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  tags?: string[];
}
