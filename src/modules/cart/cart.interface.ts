interface CartItem {
  product_id: string;
  quantity: number;
  addons?: { addon_id: string; quantity: number }[];
}

export interface Cart {
  _id?: string;
  user_id: string;
  items: CartItem[];
  updated_at: Date;
}
