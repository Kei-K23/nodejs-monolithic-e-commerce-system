import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must be at least 3 character long'),
      description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 character long'),
    })
    .strict(),
});

export const updateCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must be at least 3 character long')
        .optional(),
      description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 character long')
        .optional(),
    })
    .strict(),
});

export const getCategoryByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    })
    .strict(),
});
