export interface ReportIssue {
  _id?: string;
  reporter_id: string;
  target_type: 'order' | 'restaurant' | 'user';
  target_id: string;
  reason: string;
  status: 'new' | 'reviewing' | 'resolved';
  created_at: Date;
}
