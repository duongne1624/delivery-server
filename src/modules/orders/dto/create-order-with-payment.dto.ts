import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemInput {
  @ApiProperty({ example: 'f12e3c91-2b6b-41c4-b90a-a1ce4d7d7ef1' })
  @IsString()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export enum PaymentMethod {
  COD = 'cod',
  MOMO = 'momo',
  VNPAY = 'vnpay',
}

export class CreateOrderWithPaymentDto {
  @ApiProperty({
    description: 'Danh sách sản phẩm trong đơn hàng',
    type: [OrderItemInput],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @ApiProperty({ description: 'Tổng giá đơn hàng', example: 120000 })
  @IsNumber()
  total_price: number;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Q1',
  })
  @IsNotEmpty()
  @IsString()
  delivery_address: string;

  @ApiPropertyOptional({
    description: 'Ghi chú thêm cho đơn hàng',
    example: 'Không hành, giao buổi tối',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
