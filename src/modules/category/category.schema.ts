import { Schema } from 'mongoose';

export const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});
