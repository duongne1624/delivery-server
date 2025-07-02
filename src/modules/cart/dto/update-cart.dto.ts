import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddonCartDto {
  @IsString() addon_id: string;
  @IsNumber() quantity: number;
}

class CartItemDto {
  @IsString() product_id: string;
  @IsNumber() quantity: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonCartDto)
  addons?: AddonCartDto[];
}

export class UpdateCartDto {
  @IsString() user_id: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
