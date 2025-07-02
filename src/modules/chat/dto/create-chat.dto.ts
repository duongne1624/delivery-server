import { IsString, IsIn } from 'class-validator';

export class CreateChatDto {
  @IsString()
  order_id: string;

  @IsIn(['user', 'shipper', 'admin'])
  sender_type: 'user' | 'shipper' | 'admin';

  @IsString()
  sender_id: string;

  @IsString()
  message: string;
}
