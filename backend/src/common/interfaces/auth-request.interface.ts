import type { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    profileId: string;
    sub: string;
    email: string;
  };
}
