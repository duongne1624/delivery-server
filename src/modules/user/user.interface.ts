export type UserRole = 'user' | 'admin' | 'shipper';

export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}
