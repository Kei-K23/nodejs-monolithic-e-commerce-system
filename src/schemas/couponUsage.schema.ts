import { z } from 'zod';

export const createCouponUsageSchema = z.object({
  body: z
    .object({
      userId: z
        .string({ required_error: 'User ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
      orderId: z
        .string({ required_error: 'Order ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
      couponId: z
        .string({ required_error: 'Coupon ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid coupon ID'),
    })
    .strict(),
});

export const getCouponUsageByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid coupon usage ID'),
    })
    .strict(),
});

export const getCouponUsageByCouponIdSchema = z.object({
  params: z
    .object({
      couponId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid coupon ID'),
    })
    .strict(),
});

export type InputCouponUsage = z.infer<
  typeof createCouponUsageSchema.shape.body
>;
