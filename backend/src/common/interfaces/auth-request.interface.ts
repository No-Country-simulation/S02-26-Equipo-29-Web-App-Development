import type { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    profile_id: string;
    sub: string;
    email: string;
  };
}
