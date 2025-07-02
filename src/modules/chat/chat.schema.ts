import { Schema } from 'mongoose';

export const ChatSchema = new Schema({
  order_id: { type: String, required: true },
  sender_type: {
    type: String,
    enum: ['user', 'shipper', 'admin'],
    required: true,
  },
  sender_id: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
