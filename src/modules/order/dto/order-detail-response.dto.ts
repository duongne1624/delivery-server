export class OrderDetailResponseDto {
  _id: string;

  user: {
    _id: string;
    name: string;
    phone: string;
  };

  shipper?: {
    _id: string;
    name: string;
    phone: string;
  };

  restaurant: {
    _id: string;
    name: string;
    address: string;
    phone?: string;
  };

  products: {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    addons?: {
      addon_id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
  }[];

  total_price: number;

  status: 'pending' | 'accepted' | 'delivering' | 'completed' | 'cancelled';

  created_at: Date;
}
