import logger from '@/config/logger.config';
import { OrderService } from '@/services/order.service';
import { UserService } from '@/services/user.service';
import { NextFunction, Request, Response } from 'express';

export default class UserController {
  static newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.create(req.body);

      res.status(201).type('json').json(user);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAll();
      res.status(200).type('json').json(users);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getOrdersById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orders = await OrderService.getAllByUserId(req.params.id);
      res.status(200).type('json').json(orders);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await UserService.getOneById(req.params.id);
      res.status(200).type('json').json(user);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.status(200).type('json').json(user);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await UserService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
