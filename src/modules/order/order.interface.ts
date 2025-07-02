export interface Order {
  _id?: string;
  user_id: string;
  restaurant_id: string;
  products: {
    product_id: string;
    quantity: number;
    addons?: { addon_id: string; quantity: number }[];
  }[];
  total_price: number;
  status: 'pending' | 'accepted' | 'delivering' | 'completed' | 'cancelled';
  created_at: Date;
}
