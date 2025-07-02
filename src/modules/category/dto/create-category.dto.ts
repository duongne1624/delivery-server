import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Món ăn nhanh', description: 'Tên danh mục' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Các món ăn phục vụ nhanh chóng' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, description: 'Trạng thái kích hoạt' })
  @IsBoolean()
  is_active: boolean;
}
