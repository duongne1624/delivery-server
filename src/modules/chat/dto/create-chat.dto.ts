import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    example: '64a7c5df8e5bfa001e4e1a77',
    description: 'ID của đơn hàng liên quan đến cuộc trò chuyện',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'shipper', 'admin'],
    description: 'Loại người gửi tin nhắn',
  })
  @IsIn(['user', 'shipper', 'admin'])
  sender_type: 'user' | 'shipper' | 'admin';

  @ApiProperty({
    example: '64a7c5df8e5bfa001e4e1a99',
    description: 'ID của người gửi tin nhắn',
  })
  @IsString()
  sender_id: string;

  @ApiProperty({
    example: 'Tôi đang chờ món ăn, mất bao lâu nữa vậy?',
    description: 'Nội dung tin nhắn',
  })
  @IsString()
  message: string;
}
