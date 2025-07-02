export interface AuditLog {
  _id?: string;
  actor_id: string;
  actor_type: 'user' | 'admin' | 'shipper' | 'system';
  action: 'create' | 'update' | 'delete' | 'login';
  target: {
    collection: string;
    document_id: string;
  };
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  device_info?: string;
  created_at: Date;
}
