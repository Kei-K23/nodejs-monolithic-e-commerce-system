import logger from '@/config/logger.config';
import { CouponService } from '@/services/coupon.service';
import { NextFunction, Request, Response } from 'express';

export default class CouponController {
  static newCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const coupon = await CouponService.create(req.body);
      res.status(201).type('json').json(coupon);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await CouponService.getAll();
      res.status(200).type('json').json(coupons);
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
      const coupon = await CouponService.getOneById(req.params.id);
      res.status(200).type('json').json(coupon);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const coupon = await CouponService.update(req.params.id, req.body);
      res.status(200).type('json').json(coupon);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await CouponService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
