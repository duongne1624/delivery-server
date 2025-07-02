import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category_id: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  price: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});
