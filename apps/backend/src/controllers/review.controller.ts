import logger from '@/config/logger.config';
import { NextFunction, Request, Response } from 'express';
import { ReviewService } from '@/services/review.service';

export default class ReviewController {
  static newReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const review = await ReviewService.create(req.user?.id, {
        ...req.body,
      });

      res.status(201).type('json').json(review);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await ReviewService.getAll();
      res.status(200).type('json').json(reviews);
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
      const review = await ReviewService.getOneById(req.params.id);
      res.status(200).type('json').json(review);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static edit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await ReviewService.update(
        req.params.id,
        req.user?.id,
        req.body,
      );
      res.status(200).type('json').json(review);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ReviewService.delete(req.params.id);
      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
