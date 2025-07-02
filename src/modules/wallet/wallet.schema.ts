import { Schema } from 'mongoose';

export const WalletTransactionSchema = new Schema({
  user_id: { type: String, required: true },
  type: {
    type: String,
    enum: ['topup', 'payment', 'refund'],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  description: String,
  created_at: { type: Date, default: Date.now },
});
