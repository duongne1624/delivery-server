import { Schema } from 'mongoose';

export const AuditLogSchema = new Schema({
  actor_id: String,
  actor_type: {
    type: String,
    enum: ['user', 'admin', 'shipper', 'system'],
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login'],
  },
  target: {
    collection: String,
    document_id: String,
  },
  old_data: Schema.Types.Mixed,
  new_data: Schema.Types.Mixed,
  ip_address: String,
  device_info: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});
