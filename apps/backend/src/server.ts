import 'dotenv/config';
import { Server } from 'http';
import mongoose from 'mongoose';
import { envConfig } from '@/config/env.config';
import { app } from '@/app';

let server: Server;

// Mongodb connection with Mongoose
mongoose
  .connect(envConfig.database.connectionStr)
  .then(() => {
    console.log('Successfully connected to Database');
    server = app.listen(envConfig.app.port, () => {
      console.log(
        `🚀 Server is running on http://localhost:${envConfig.app.port}`,
      );
    });
  })
  .catch((e) => {
    console.error('Database connection error: ', e);
    process.exit(1);
  });

const existHandler = () => {
  if (server) {
    console.log('Server closed');
    server.close();
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const cleanUp = async () => {
  try {
    console.log('\n🛑 Gracefully shutting down...');
    if (server) {
      server.close();
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed.');

    process.exit(0);
  } catch (error: any) {
    unexpectedErrorHandler(error);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error('Unexpected error occur: ', error);
  existHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Handle SIGINT (CTRL+C)
process.on('SIGINT', cleanUp);
// Handle SIGTERM (For Docker, PM2, etc.)
process.on('SIGTERM', cleanUp);
