import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID của người nhận thông báo',
    example: '64e8a8f7e4b7f5a3b9c0d123',
  })
  @IsString()
  recipient_id: string;

  @ApiProperty({
    description: 'Loại người nhận',
    enum: ['user', 'shipper', 'admin'],
    example: 'user',
  })
  @IsIn(['user', 'shipper', 'admin'])
  recipient_type: 'user' | 'shipper' | 'admin';

  @ApiProperty({
    description: 'Tiêu đề thông báo',
    example: 'Đơn hàng đã được xác nhận',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Nội dung thông báo',
    example: 'Cảm ơn bạn đã đặt hàng. Shipper đang đến!',
  })
  @IsString()
  message: string;
}
