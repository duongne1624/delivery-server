export interface LoginPayload {
  user_id: string;
  role: 'user' | 'admin' | 'shipper';
}
