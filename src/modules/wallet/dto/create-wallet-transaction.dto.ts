import { IsString, IsIn, IsNumber, IsOptional } from 'class-validator';

export class CreateWalletTransactionDto {
  @IsString()
  user_id: string;

  @IsIn(['topup', 'payment', 'refund'])
  type: 'topup' | 'payment' | 'refund';

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
