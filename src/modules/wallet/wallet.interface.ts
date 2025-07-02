export interface WalletTransaction {
  _id?: string;
  user_id: string;
  type: 'topup' | 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: Date;
}
