import { ForbiddenError, UnauthorizedError } from '@/exceptions';
import { NextFunction, Request, Response } from 'express';

export const checkRoles =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('Missing or invalid token');
      }

      if (roles.includes(user.role)) next();
      else throw new ForbiddenError('Permission denied');
    } catch (error) {
      next(error);
    }
  };
