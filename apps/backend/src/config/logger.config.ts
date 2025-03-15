import winston from 'winston';

const logFormat = winston.format.prettyPrint({
  colorize: true,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }), // Logs for error level
    new winston.transports.File({
      filename: 'logs/combined.log',
    }), // Logs for every level
  ],
});

export default logger;
