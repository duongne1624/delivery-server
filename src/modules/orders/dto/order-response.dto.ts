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

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty({ type: UserSummaryDto })
  customer: UserSummaryDto;

  @ApiProperty({ type: UserSummaryDto, nullable: true })
  shipper?: UserSummaryDto | null;

  @ApiProperty({ type: [OrderItemSummaryDto] })
  items: OrderItemSummaryDto[];
}
