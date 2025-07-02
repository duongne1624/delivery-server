export interface Voucher {
  _id?: string;
  code: string;
  description?: string;
  discount_type: 'fixed' | 'percent';
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: Date;
  end_date: Date;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  target: 'public' | 'first_order' | 'user';
  created_at: Date;
}
