import { ORDER_STATUS } from '@/models/order.model';
import { PAYMENT_STATUS } from '@/models/payment.model';
import { z } from 'zod';

const createOrderItemSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  quantity: z.number().positive(),
});

export const createOrderSchema = z.object({
  body: z
    .object({
      userId: z
        .string({ required_error: 'User ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
      orderStatus: z
        .nativeEnum(ORDER_STATUS)
        .default(ORDER_STATUS.PENDING)
        .optional(),
      paymentStatus: z
        .nativeEnum(PAYMENT_STATUS)
        .default(PAYMENT_STATUS.PENDING)
        .optional(),
      orderItems: z.array(createOrderItemSchema),
    })
    .strict(),
});

export const getOrderByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
    })
    .strict(),
});

export type InputOrder = z.infer<typeof createOrderSchema.shape.body>;
