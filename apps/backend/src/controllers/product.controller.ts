import logger from '@/config/logger.config';
import { ProductService } from '@/services/product.service';
import { NextFunction, Request, Response } from 'express';

export default class ProductController {
  static newProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const product = await ProductService.create(req.body);

      res.status(201).type('json').json(product);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductService.getAll();
      res.status(200).type('json').json(products);
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
      const product = await ProductService.getOneById(req.params.id);
      res.status(200).type('json').json(product);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      res.status(200).type('json').json(product);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await ProductService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
