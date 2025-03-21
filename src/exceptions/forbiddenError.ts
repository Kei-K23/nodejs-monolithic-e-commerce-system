import { ApiError } from './apiError';

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}
