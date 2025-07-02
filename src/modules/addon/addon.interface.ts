export interface Addon {
  _id?: string;
  name: string;
  price: number;
  is_active: boolean;
  restaurant_id: string;
  created_at: Date;
}
