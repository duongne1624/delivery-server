import { Schema } from 'mongoose';

export const ReportIssueSchema = new Schema({
  reporter_id: { type: String, required: true },
  target_type: {
    type: String,
    enum: ['order', 'restaurant', 'user'],
    required: true,
  },
  target_id: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'resolved'],
    default: 'new',
  },
  created_at: { type: Date, default: Date.now },
});
