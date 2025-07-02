import {
  IsString,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddonDto {
  @IsString()
  addon_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

class ProductOrderDto {
  @IsString()
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonDto)
  addons?: AddonDto[];
}

export class CreateOrderDto {
  @IsString()
  restaurant_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsNumber()
  @Min(0)
  total_price: number;
}
