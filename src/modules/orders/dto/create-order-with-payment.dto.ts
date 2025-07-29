import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
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
  ZALOPAY = 'zalopay',
}

export class CreateOrderWithPaymentDto {
  @ApiProperty({ type: [OrderItemInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @ApiPropertyOptional({
    description: 'ID của địa chỉ có sẵn',
    example: '4c85ef5b-1234-4eec-9af0-76de13f2d456',
  })
  @IsOptional()
  @IsString()
  address_id?: string;

  @ApiPropertyOptional({ example: '12 Lê Lợi, Quận 1, TP.HCM' })
  @IsOptional()
  @IsString()
  delivery_address?: string;

  @ApiPropertyOptional({ example: 10.762622 })
  @IsOptional()
  @IsNumber()
  delivery_latitude?: number;

  @ApiPropertyOptional({ example: 106.660172 })
  @IsOptional()
  @IsNumber()
  delivery_longitude?: number;

  @ApiPropertyOptional({ example: 'ChIJ0wzLpFQudTER3OAYwV_NeIM' })
  @IsOptional()
  @IsString()
  delivery_place_id?: string;

  @ApiPropertyOptional({ example: 'Không hành, gọi trước khi đến' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiPropertyOptional({ example: 'http://dfjlkdh.com' })
  @IsOptional()
  @IsString()
  return_url?: string;
}
