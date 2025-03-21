import { z } from 'zod';

export const createCouponSchema = z.object({
  body: z
    .object({
      discount: z
        .number({ required_error: 'Discount is required' })
        .positive()
        .min(5, 'Discount percentage at least should be 5'),
      usageLimit: z
        .number({ required_error: 'Usage limit is required' })
        .positive(),
      validFrom: z.coerce.date(),
      validTo: z.coerce.date(),
    })
    .strict(),
});

export const updateCouponSchema = z.object({
  body: z
    .object({
      discount: z
        .number({ required_error: 'Discount is required' })
        .positive()
        .min(5, 'Discount percentage at least should be 5')
        .optional(),
      usageLimit: z
        .number({ required_error: 'Usage limit is required' })
        .positive()
        .optional(),
      validFrom: z.coerce.date().optional(),
      validTo: z.coerce.date().optional(),
    })
    .strict(),
});

export const getCouponByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid coupon ID'),
    })
    .strict(),
});

export type InputCoupon = z.infer<typeof createCouponSchema.shape.body>;
