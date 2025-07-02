export interface ChatMessage {
  _id?: string;
  order_id: string;
  sender_type: 'user' | 'shipper' | 'admin';
  sender_id: string;
  message: string;
  created_at: Date;
  read: boolean;
}
