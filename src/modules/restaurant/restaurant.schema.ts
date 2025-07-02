import { Schema } from 'mongoose';

export const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  owner_id: { type: String, required: true },
  phone: { type: String },
  is_open: { type: Boolean, default: true },
  open_time: { type: String },
  close_time: { type: String },
  location: {
    lat: Number,
    lng: Number,
  },
  created_at: { type: Date, default: Date.now },
});
