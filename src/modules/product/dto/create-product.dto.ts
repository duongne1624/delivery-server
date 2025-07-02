import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm', example: 'Bún bò Huế' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả sản phẩm',
    example: 'Thơm ngon, đậm đà hương vị Huế',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'ID của danh mục sản phẩm',
    example: '60f8c4622f8fb814c89d88cd',
  })
  @IsString()
  category_id: string;

  @ApiProperty({
    description: 'ID của nhà hàng',
    example: '60f8c4622f8fb814c89d88af',
  })
  @IsString()
  restaurant_id: string;

  @ApiProperty({ description: 'Giá sản phẩm', example: 45000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Trạng thái còn hàng hay không', example: true })
  @IsBoolean()
  is_available: boolean;
}
