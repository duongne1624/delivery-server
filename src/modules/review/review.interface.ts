export interface Review {
  _id?: string;
  user_id: string;
  target_type: 'product' | 'restaurant';
  target_id: string;
  rating: number;
  comment?: string;
  tags?: string[];
  created_at: Date;
}
