import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().default('YOUR_JWT_SECRET'),
  JWT_EXPIRES_IN: z.preprocess(
    (val) => Number(val),
    z.number().default(604800000),
  ), // Convert string into number
  IMAGE_UPLOAD_URL_ENDPOINT: z.string(),
  IMAGE_UPLOAD_PRIVATE_KEY: z.string(),
  IMAGE_UPLOAD_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  NODEMAILER_EMAIL_USER: z.string(),
  NODEMAILER_EMAIL_PASS: z.string(),
  REDIS_SERVER_URL: z.string(),
  APP_URL: z.string().default('http://localhost:3000'),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('Invalid or missing environment variables ', envVars.error);
  process.exit(1);
}

export const envConfig = {
  app: {
    env: envVars.data.NODE_ENV,
    port: envVars.data.PORT,
    url: envVars.data.APP_URL,
  },
  database: {
    connectionStr: envVars.data.MONGODB_URI,
  },
  redis: {
    connectionStr: envVars.data.REDIS_SERVER_URL,
  },
  jwt: {
    secretKey: envVars.data.JWT_SECRET,
    expiresIn: envVars.data.JWT_EXPIRES_IN,
  },
  imageUpload: {
    urlEndpoint: envVars.data.IMAGE_UPLOAD_URL_ENDPOINT,
    privateKey: envVars.data.IMAGE_UPLOAD_PRIVATE_KEY,
    publicKey: envVars.data.IMAGE_UPLOAD_PUBLIC_KEY,
  },
  stripe: {
    secret: envVars.data.STRIPE_SECRET_KEY,
    webSecret: envVars.data.STRIPE_WEBHOOK_SECRET,
  },
  email: {
    username: envVars.data.NODEMAILER_EMAIL_USER,
    password: envVars.data.NODEMAILER_EMAIL_PASS,
  },
};
