import { Schema } from 'mongoose';

export const NotificationSchema = new Schema({
  recipient_id: String,
  recipient_type: {
    type: String,
    enum: ['user', 'shipper', 'admin'],
  },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});
