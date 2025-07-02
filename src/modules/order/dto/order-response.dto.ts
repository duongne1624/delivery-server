// src/modules/order/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ description: 'Id đơn hàng' })
  _id: string;

  @ApiProperty({ description: 'Id người mua' })
  user_id: string;

  @ApiProperty({ description: 'Id quán ăn' })
  restaurant_id: string;

  @ApiProperty({ description: 'Tổng cộng' })
  total_price: number;

  @ApiProperty({
    enum: ['pending', 'accepted', 'delivering', 'completed', 'cancelled'],
    description: 'Trạng thái',
  })
  status: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;
}
