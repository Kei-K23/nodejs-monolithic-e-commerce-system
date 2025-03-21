import logger from '@/config/logger.config';
import { PaymentService } from '@/services/payment.service';
import { NextFunction, Request, Response } from 'express';

export default class PaymentController {
  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await PaymentService.getAll();
      res.status(200).type('json').json(payments);
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
      const payment = await PaymentService.getOneById(req.params.id);
      res.status(200).type('json').json(payment);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
