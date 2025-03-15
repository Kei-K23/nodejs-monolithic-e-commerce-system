import { envConfig } from '@/config/env.config';
import { UnauthorizedError } from '@/exceptions';
import { User } from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const checkJWT = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')?.[1];

    if (!token) throw new UnauthorizedError('Missing token');

    const { userId } = <
      {
        userId: string;
      }
    >jwt.verify(token, envConfig.jwt.secretKey, {
      algorithms: ['HS256'],
    });

    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Missing or invalid token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
