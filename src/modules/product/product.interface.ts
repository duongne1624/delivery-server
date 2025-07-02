export interface Product {
  _id?: string;
  name: string;
  description?: string;
  category_id: string;
  restaurant_id: string;
  price: number;
  is_available: boolean;
  created_at: Date;
}
