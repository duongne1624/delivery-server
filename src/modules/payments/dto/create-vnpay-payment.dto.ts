import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVnpayPaymentDto {
  @ApiProperty({ example: 150000, description: 'Số tiền thanh toán (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Thanh toán đơn hàng #123' })
  @IsString()
  orderDescription: string;

  @ApiProperty({
    example: 'order-id-uuid',
    description: 'ID đơn hàng (nếu có)',
  })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ example: 'VNPAYQR', required: false })
  @IsString()
  @IsOptional()
  bankCode?: string;
}
