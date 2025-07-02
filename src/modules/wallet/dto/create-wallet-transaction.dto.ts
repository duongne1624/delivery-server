import { IsString, IsIn, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWalletTransactionDto {
  @ApiProperty({ example: '64ff123abc456def78900011' })
  @IsString()
  user_id: string;

  @ApiProperty({
    enum: ['topup', 'payment', 'refund'],
    example: 'topup',
  })
  @IsIn(['topup', 'payment', 'refund'])
  type: 'topup' | 'payment' | 'refund';

  @ApiProperty({ example: 50000, description: 'Amount in VND' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 'Nạp tiền từ ví Momo' })
  @IsOptional()
  @IsString()
  description?: string;
}
