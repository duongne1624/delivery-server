import { Schema } from 'mongoose';

export const FeatureFlagSchema = new Schema({
  key: { type: String, required: true, unique: true },
  description: String,
  is_enabled: { type: Boolean, default: true },
  updated_at: { type: Date, default: Date.now },
});
