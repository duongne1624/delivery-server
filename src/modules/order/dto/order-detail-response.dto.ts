import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ description: 'ID của người dùng' })
  _id: string;

  @ApiProperty({ description: 'Tên người dùng' })
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  phone: string;
}

class ShipperDto {
  @ApiProperty({ description: 'ID của Shipper' })
  _id: string;

  @ApiProperty({ description: 'Tên shipper' })
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  phone: string;
}

class RestaurantDto {
  @ApiProperty({ description: 'ID của quán ăn' })
  _id: string;

  @ApiProperty({ description: 'Tên quán ăn' })
  name: string;

  @ApiProperty({ description: 'Địa chỉ' })
  address: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  phone?: string;
}

class AddonDetailDto {
  @ApiProperty({ description: 'ID của addon' })
  addon_id: string;

  @ApiProperty({ description: 'Tên của addon' })
  name: string;

  @ApiProperty({ description: 'Số lượng' })
  quantity: number;

  @ApiProperty({ description: 'Giá' })
  price: number;
}

class ProductDetailDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  product_id: string;

  @ApiProperty({ description: 'Tên sản phẩm' })
  name: string;

  @ApiProperty({ description: 'Số lượng sản phẩm' })
  quantity: number;

  @ApiProperty({ description: 'Giá' })
  price: number;

  @ApiPropertyOptional({
    type: [AddonDetailDto],
    description: 'Danh sách addon',
  })
  addons?: AddonDetailDto[];
}

export class OrderDetailResponseDto {
  @ApiProperty({ description: 'ID của order' })
  _id: string;

  @ApiProperty({ type: UserDto, description: 'Người mua' })
  user: UserDto;

  @ApiPropertyOptional({ type: ShipperDto, description: 'Shipper' })
  shipper?: ShipperDto;

  @ApiProperty({ type: RestaurantDto, description: 'Quán ăn' })
  restaurant: RestaurantDto;

  @ApiProperty({ type: [ProductDetailDto], description: 'Món ăn' })
  products: ProductDetailDto[];

  @ApiProperty({ description: 'Tổng cộng' })
  total_price: number;

  @ApiProperty({
    enum: ['pending', 'accepted', 'delivering', 'completed', 'cancelled'],
    description: 'Trạng thái đơn hàng',
  })
  status: 'pending' | 'accepted' | 'delivering' | 'completed' | 'cancelled';

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;
}
