import { USER_ROLE } from '@/models/user.model';
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      username: z.string().min(3, 'Username must be at least 3 character long'),
      name: z.string().min(3, 'Name must be at least 3 character long'),
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 character long'),
      role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER).optional(),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 character long'),
    })
    .strict(),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 character long')
        .optional(),
      name: z
        .string()
        .min(3, 'Name must be at least 3 character long')
        .optional(),
      email: z.string().email('Invalid email format').optional(),
      password: z
        .string()
        .min(6, 'Password must be at least 6 character long')
        .optional(),
      role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER).optional(),
    })
    .strict(),
});

export const getUserByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    })
    .strict(),
});
