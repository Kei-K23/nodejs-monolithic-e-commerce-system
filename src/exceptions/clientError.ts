import { ApiError } from './apiError';

export class ClientError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}
