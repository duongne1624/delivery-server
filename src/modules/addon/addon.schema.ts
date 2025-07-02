import { Schema } from 'mongoose';

export const AddonSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
  restaurant_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
