import { envConfig } from '@/config/env.config';
import Redis from 'ioredis';

const redis = new Redis(envConfig.redis.connectionStr);

export const setKey = async ({ key, value }: { key: any[]; value: any }) => {
  return await redis.set(JSON.stringify(key), JSON.stringify(value), 'EX', 60);
};

export const getValue = async ({ key }: { key: any[] }) => {
  const value = await redis.get(JSON.stringify(key));
  if (!value) {
    return null;
  }
  return JSON.parse(value);
};

export const deleteValue = async ({ key }: { key: any[] }) => {
  return await redis.del(JSON.stringify(key));
};

export const updateValue = async ({
  key,
  newValue,
}: {
  key: any[];
  newValue: any;
}) => {
  await redis.del(key);
  return await redis.set(
    JSON.stringify(key),
    JSON.stringify(newValue),
    'EX',
    60,
  );
};
