import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewTagDto {
  @ApiProperty({ example: 'Ngon', description: 'Tên thẻ đánh giá (tag)' })
  @IsString()
  tag: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của thẻ (mặc định là true)',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
