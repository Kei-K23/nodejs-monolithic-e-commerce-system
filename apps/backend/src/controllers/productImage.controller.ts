import logger from '@/config/logger.config';
import { ClientError } from '@/exceptions';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { uploadLocalFile } from '@/utils/upload';
import { ProductImageService } from '@/services/productImage.service';
import { requestProductImageSchema } from '@/schemas/productImage.schema';

export default class ProductImageController {
  static newProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.file) {
        throw new ClientError('No product image uploaded');
      }

      if (!req.body.productId) {
        throw new ClientError('Missing product id');
      }

      const formData = {
        productId: req.body.productId,
        image: req.file || null,
      };

      requestProductImageSchema.parse(formData);

      const response = await uploadLocalFile(
        formData.image.buffer,
        `${Date.now()}-${formData.image.originalname}`,
      );

      if (!response.url) {
        throw new ClientError('Uploaded image url not found');
      }

      const productImgRes = await ProductImageService.create({
        imageUrl: response.url,
        productId: formData.productId,
      });

      res.status(201).type('json').json(productImgRes);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
