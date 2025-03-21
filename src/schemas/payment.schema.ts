import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/models/payment.model';
import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z
    .object({
      userId: z
        .string({ required_error: 'User ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
      orderId: z
        .string({ required_error: 'Order ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
      amount: z.number({ required_error: 'Amount is required' }).positive(),
      transactionId: z.string({ required_error: 'Transaction ID is required' }),
      paymentMethod: z.nativeEnum(PAYMENT_METHOD),
      status: z.nativeEnum(PAYMENT_STATUS),
    })
    .strict(),
});

export const getPaymentByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid payment ID'),
    })
    .strict(),
});

export type InputPayment = z.infer<typeof createPaymentSchema.shape.body>;
