import { Schema } from 'mongoose';

export const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  description: String,
  discount_type: { type: String, enum: ['fixed', 'percent'], required: true },
  discount_value: { type: Number, required: true },
  min_order_value: Number,
  max_discount: Number,
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  usage_limit: { type: Number, default: 100 },
  used_count: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  target: {
    type: String,
    enum: ['public', 'first_order', 'user'],
    default: 'public',
  },
  created_at: { type: Date, default: Date.now },
});
