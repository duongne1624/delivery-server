import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '456 Đường XYZ, Quận 5, TP.HCM',
  })
  @IsNotEmpty()
  @IsString()
  delivery_address: string;

  @ApiPropertyOptional({
    description: 'Ghi chú cho đơn hàng',
    example: 'Giao giờ nghỉ trưa, không lấy ớt',
  })
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm trong đơn hàng',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
