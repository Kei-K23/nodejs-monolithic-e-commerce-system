import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const requestProductImageSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  image: z
    .object({
      mimetype: z
        .string()
        .refine((type) => ACCEPTED_FILE_TYPES.includes(type), {
          message: 'File must be a PNG/JPEG/JPG',
        }),
      size: z.number().max(MAX_UPLOAD_SIZE, {
        message: 'File size must be less than 3MB',
      }),
    })
    .refine((file) => !!file, { message: 'Image file is required' }),
});

export const getProductImageByIdSchema = z.object({
  params: z
    .object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product image ID'),
    })
    .strict(),
});
