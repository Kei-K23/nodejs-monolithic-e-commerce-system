import { envConfig } from '@/config/env.config';
import mongoose from 'mongoose';
import { ZodIssue } from 'zod';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    stack: string | ZodIssue[] | mongoose.Error | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Only when error stack provide and only in development mode
    if (stack && envConfig.app.env === 'development') {
      this.stack = JSON.stringify(stack);
    }
    Error.captureStackTrace(this);
  }
}
