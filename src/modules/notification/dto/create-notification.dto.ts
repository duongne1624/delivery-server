import { IsString, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  recipient_id: string;

  @IsIn(['user', 'shipper', 'admin'])
  recipient_type: 'user' | 'shipper' | 'admin';

  @IsString()
  title: string;

  @IsString()
  message: string;
}
