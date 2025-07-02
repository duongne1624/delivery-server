export interface Notification {
  _id?: string;
  recipient_id: string;
  recipient_type: 'user' | 'shipper' | 'admin';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
}
