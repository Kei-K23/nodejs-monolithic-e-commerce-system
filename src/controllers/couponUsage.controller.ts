import logger from '@/config/logger.config';
import { CouponUsageService } from '@/services/couponUsage.service';
import { NextFunction, Request, Response } from 'express';

export default class CouponUsageController {
  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const couponUsages = await CouponUsageService.getAll();
      res.status(200).type('json').json(couponUsages);
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
      const couponUsage = await CouponUsageService.getOneById(req.params.id);
      res.status(200).type('json').json(couponUsage);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
