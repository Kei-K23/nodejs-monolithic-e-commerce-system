import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check request have proper validation
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
