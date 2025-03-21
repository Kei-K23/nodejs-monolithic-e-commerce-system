import logger from '@/config/logger.config';
import { CategoryService } from '@/services/category.service';
import { NextFunction, Request, Response } from 'express';

export default class CategoryController {
  static newCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await CategoryService.create(req.body);

      res.status(201).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await CategoryService.getAll();
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
      const category = await CategoryService.getOneById(req.params.id);
      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      res.status(200).type('json').json(category);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await CategoryService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
