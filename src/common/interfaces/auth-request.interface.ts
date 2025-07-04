import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    role: 'admin' | 'user' | 'shipper';
    name?: string;
    email?: string;
  };
}
