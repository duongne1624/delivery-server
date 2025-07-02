import {
  IsString,
  IsIn,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreateReviewDto {
  @IsIn(['product', 'restaurant'])
  target_type: 'product' | 'restaurant';

  @IsString()
  target_id: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  tags?: string[];
}
