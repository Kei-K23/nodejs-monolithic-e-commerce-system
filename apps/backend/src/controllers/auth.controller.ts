import logger from '@/config/logger.config';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { NextFunction, Request, Response } from 'express';

export default class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login({ email, password });

      res.status(200).type('json').json({
        token,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Register is also create user, so directly call User service
      const user = await UserService.createUser(req.body);
      res.status(201).type('json').json(user);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
