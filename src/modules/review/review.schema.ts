import { Schema } from 'mongoose';

export const ReviewSchema = new Schema({
  user_id: { type: String, required: true },
  target_type: {
    type: String,
    enum: ['product', 'restaurant'],
    required: true,
  },
  target_id: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  tags: [String],
  created_at: { type: Date, default: Date.now },
});
