import logger from '@/config/logger.config';
import { ApiError } from '@/exceptions';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle App API Error
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Zod validation Error
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(statusCode).json({
      success: false,
      message,
      details,
    });
  }
  // Handle Mongoose schemas validation Error
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Mongoose schemas validation error';

    const details = Object.values(error.errors).map((e) => e.message);

    return res.status(statusCode).json({
      success: false,
      message,
      details,
    });
  }
  // Handle Mongoose duplicate key errors
  else if ((error as any).code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${(error as any).keyValue}`;
  }

  logger.error(`[${req.method}] ${req.url} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
