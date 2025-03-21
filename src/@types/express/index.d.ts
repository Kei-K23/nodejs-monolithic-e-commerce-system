import { UserDocs } from '@/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserDocs, 'password'>;
    }
  }
}

export {};
