import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z
    .object({
      review: z
        .string({ required_error: 'Review is required' })
        .trim()
        .min(5, 'Review must be at least 5 character long'),
      rating: z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be greater than or equal to 1')
        .max(5, 'Rating must be less than or equal to 5'),
      productId: z
        .string({ required_error: 'Product ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export const updateReviewSchema = z.object({
  body: z
    .object({
      review: z
        .string({ required_error: 'Review is required' })
        .trim()
        .min(5, 'Review must be at least 5 character long')
        .optional(),
      rating: z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be greater than or equal to 1')
        .max(5, 'Rating must be less than or equal to 5')
        .optional(),
    })
    .strict(),
});

export const getReviewByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
    })
    .strict(),
});

export const getReviewsByProductIdSchema = z.object({
  params: z
    .object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export type InputReview = z.infer<typeof createReviewSchema.shape.body>;
