import logger from '@/config/logger.config';
import { OrderService } from '@/services/order.service';
import { NextFunction, Request, Response } from 'express';

export default class OrderController {
  static newOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await OrderService.create(req.body);

      res.status(201).type('json').json(product);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
