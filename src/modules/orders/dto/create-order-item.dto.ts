import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: '9d72d1d0-708e-4236-b301-dccca70b1df4',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
