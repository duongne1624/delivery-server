// order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;
}

export class ProductSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;
}

export class PaymentSummaryDto {
  @ApiProperty()
  method: 'momo' | 'vnpay' | 'cod' | 'zalopay';

  @ApiProperty()
  transaction_id?: string;

  @ApiProperty()
  status: 'pending' | 'success' | 'failed';

  @ApiProperty()
  amount: number;
}

export class OrderItemSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: ProductSummaryDto })
  product: ProductSummaryDto;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  delivery_address: string;

  @ApiProperty({ required: false, type: 'number', nullable: true })
  delivery_latitude?: number;

  @ApiProperty({ required: false, type: 'number', nullable: true })
  delivery_longitude?: number;

  @ApiProperty({ required: false, type: 'string', nullable: true })
  delivery_place_id?: string;

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty({ type: UserSummaryDto })
  customer: UserSummaryDto;

  @ApiProperty({ type: UserSummaryDto, nullable: true })
  shipper?: UserSummaryDto | null;

  @ApiProperty({ required: false, type: 'string', nullable: true })
  cancel_reason?: string;

  @ApiProperty({ required: false, type: 'string', nullable: true })
  shipper_confirmed_at?: Date;

  @ApiProperty({ type: [OrderItemSummaryDto] })
  items: OrderItemSummaryDto[];

  @ApiProperty({ type: PaymentSummaryDto })
  payment: PaymentSummaryDto;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
