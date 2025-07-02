import { Schema } from 'mongoose';

const CartItemSchema = new Schema(
  {
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    addons: [{ addon_id: String, quantity: Number }],
  },
  { _id: false }
);

export const CartSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  updated_at: { type: Date, default: Date.now },
});
