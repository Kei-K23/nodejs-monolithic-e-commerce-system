import { z } from 'zod';

export const createInventorySchema = z.object({
  body: z
    .object({
      stock: z
        .number({ required_error: 'Stock quantity is required' })
        .positive(),
      productId: z
        .string({ required_error: 'Product ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export const updateInventorySchema = z.object({
  body: z
    .object({
      stock: z
        .number({ required_error: 'Stock quantity is required' })
        .positive()
        .optional(),
      productId: z
        .string({ required_error: 'Product ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
        .optional(),
    })
    .strict(),
});

export const getInventoryByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid inventory ID'),
    })
    .strict(),
});

export const getInventoryByProductIdSchema = z.object({
  params: z
    .object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    })
    .strict(),
});

export type InputInventory = z.infer<typeof createInventorySchema.shape.body>;
