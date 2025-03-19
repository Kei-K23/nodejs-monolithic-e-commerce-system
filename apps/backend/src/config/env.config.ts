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
  },
  database: {
    connectionStr: envVars.data.MONGODB_URI,
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
};
