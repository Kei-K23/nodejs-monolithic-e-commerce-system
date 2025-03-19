import logger from '@/config/logger.config';
import { ClientError, NotFoundError } from '@/exceptions';
import { NextFunction, Request, Response } from 'express';
import { deleteFile, uploadLocalFile } from '@/utils/upload';
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
        fileId: response.fileId,
      });

      res.status(201).type('json').json(productImgRes);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static listAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const productImages = await ProductImageService.getAll();
      res.status(200).type('json').json(productImages);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productImage = await ProductImageService.getOneById(req.params.id);
      res.status(200).type('json').json(productImage);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static edit = async (req: Request, res: Response, next: NextFunction) => {
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

      const existingProductImg = await ProductImageService.getOneById(
        req.params.id,
      );

      if (!existingProductImg) {
        throw new NotFoundError('Product image not found');
      }

      const productImage = await ProductImageService.update({
        id: req.params.id,
        productId: formData.productId,
        imageUrl: response.url,
        fileId: response.fileId,
      });

      // Delete existing old product image in imagekit
      await deleteFile(existingProductImg.fileId);

      res.status(200).type('json').json(productImage);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingProductImg = await ProductImageService.getOneById(
        req.params.id,
      );

      if (!existingProductImg) {
        throw new NotFoundError('Product image not found');
      }

      await ProductImageService.delete(req.params.id);

      // Delete existing old product image in imagekit
      await deleteFile(existingProductImg.fileId);

      res.status(204).type('json').send();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
