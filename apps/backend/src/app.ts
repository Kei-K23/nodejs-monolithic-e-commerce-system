import express from 'express';
import morgan from 'morgan';
import logger from '@/config/logger.config';
import { errorHandler } from '@/middlewares';
import routes from '@/routes';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { NotFoundError } from './exceptions';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    limit: 100, // 15 minutes - 100 request from same IP address
  }),
);

// Compression Middleware
app.use(compression());

// Request body parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware for HTTP request
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Register all our API route handlers with single endpoint
app.use('/api/v1', routes);

// 404 handler
app.use((_req, _res, next) => {
  next(new NotFoundError('Not Found'));
});

//! Make sure to call global error handling middleware at the end of all our route handlers
// Global error handling middleware
app.use(errorHandler);

export { app };
