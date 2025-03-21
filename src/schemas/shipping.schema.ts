import { SHIPPING_STATUS } from '@/models/shipping.model';
import { z } from 'zod';

export const createShippingSchema = z.object({
  body: z
    .object({
      address: z
        .string({ required_error: 'Address is required' })
        .trim()
        .min(10, 'Address must be at least 10 character long'),
      status: z.nativeEnum(SHIPPING_STATUS).default(SHIPPING_STATUS.DELIVERED),
      orderId: z
        .string({ required_error: 'Order ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
      userId: z
        .string({ required_error: 'User ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
      estimatedDeliveryDate: z.coerce.date(),
    })
    .strict(),
});

export const updateShippingSchema = z.object({
  body: z
    .object({
      address: z
        .string({ required_error: 'Address is required' })
        .trim()
        .min(10, 'Address must be at least 10 character long')
        .optional(),
      status: z
        .nativeEnum(SHIPPING_STATUS)
        .default(SHIPPING_STATUS.PENDING)
        .optional(),
      orderId: z
        .string({ required_error: 'Order ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
      userId: z
        .string({ required_error: 'User ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
        .optional(),
      estimatedDeliveryDate: z.coerce.date().optional(),
    })
    .strict(),
});

export const getShippingByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid shipping ID'),
    })
    .strict(),
});

export type InputShipping = z.infer<typeof createShippingSchema.shape.body>;
