import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddonCartDto {
  @ApiProperty({ example: '64f5bcd11a0b0d2b084ebf01' })
  @IsString()
  addon_id: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity: number;
}

class CartItemDto {
  @ApiProperty({ example: '64f5bcd11a0b0d2b084ebf00' })
  @IsString()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({
    type: [AddonCartDto],
    description: 'Danh sách addon cho sản phẩm',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonCartDto)
  addons?: AddonCartDto[];
}

export class UpdateCartDto {
  @ApiProperty({ example: '64f5bccf1a0b0d2b084ebe99' })
  @IsString()
  user_id: string;

  @ApiProperty({
    type: [CartItemDto],
    description: 'Danh sách sản phẩm trong giỏ hàng',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
