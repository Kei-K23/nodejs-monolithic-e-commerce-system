import logger from '@/config/logger.config';
import { OrderService } from '@/services/order.service';
import { NextFunction, Request, Response } from 'express';

export default class OrderController {
  static newOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { couponCode } = req.query;
      const product = await OrderService.create(req.body, couponCode as string);

      res.status(201).type('json').json(product);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderService.getAll();
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
      const order = await OrderService.getOneById(req.params.id);
      res.status(200).type('json').json(order);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
