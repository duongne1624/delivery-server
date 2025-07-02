import {
  IsString,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddonDto {
  @ApiProperty({ description: 'ID của addon' })
  @IsString()
  addon_id: string;

  @ApiProperty({ description: 'Số lượng addon', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

class ProductOrderDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  @IsString()
  product_id: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Danh sách addon được chọn cho sản phẩm',
    type: [AddonDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonDto)
  addons?: AddonDto[];
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID của nhà hàng' })
  @IsString()
  restaurant_id: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm trong đơn hàng',
    type: [ProductOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @ApiProperty({ description: 'Tổng tiền đơn hàng', minimum: 0 })
  @IsNumber()
  @Min(0)
  total_price: number;
}
