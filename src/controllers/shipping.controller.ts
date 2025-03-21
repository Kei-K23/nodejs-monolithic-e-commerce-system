import logger from '@/config/logger.config';
import { ShippingService } from '@/services/shipping.service';
import { NextFunction, Request, Response } from 'express';

export default class ShippingController {
  static newShipping = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const shipping = await ShippingService.create(req.body);
      res.status(201).type('json').json(shipping);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const shippings = await ShippingService.getAll();
      res.status(200).type('json').json(shippings);
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
      const shipping = await ShippingService.getOneById(req.params.id);
      res.status(200).type('json').json(shipping);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editShipping = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const shipping = await ShippingService.update(req.params.id, req.body);
      res.status(200).type('json').json(shipping);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteShipping = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await ShippingService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
