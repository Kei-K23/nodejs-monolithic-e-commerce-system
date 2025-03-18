import { z } from 'zod';

export const createProductSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must be at least 3 character long'),
      description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 character long'),
      price: z.number({ required_error: 'Price is required' }).positive(),
      stockQuantity: z
        .number({ required_error: 'Stock quantity is required' })
        .positive(),
      categoryId: z
        .string({ required_error: 'Category ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export const updateProductSchema = z.object({
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
      price: z
        .number({ required_error: 'Price is required' })
        .positive()
        .optional(),
      stockQuantity: z
        .number({ required_error: 'Stock quantity is required' })
        .positive()
        .optional(),
      categoryId: z
        .string({ required_error: 'Category ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
        .optional(),
    })
    .strict(),
});

export const getProductByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export type InputProduct = z.infer<typeof createProductSchema.shape.body>;
