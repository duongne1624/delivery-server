import { Schema } from 'mongoose';

export const ReviewTagSchema = new Schema({
  tag: { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});
