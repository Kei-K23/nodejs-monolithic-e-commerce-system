import logger from '@/config/logger.config';
import { InventoryService } from '@/services/inventory.service';
import { NextFunction, Request, Response } from 'express';

export default class InventoryController {
  static newInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await InventoryService.updateStockOrCreateNewOne(
        req.body,
      );

      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await InventoryService.getAll();
      res.status(200).type('json').json(categories);
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
      const category = await InventoryService.getOneById(req.params.id);
      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getOneByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await InventoryService.getOneByProductId(
        req.params.productId,
      );
      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await InventoryService.update(req.params.id, req.body);
      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await InventoryService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
