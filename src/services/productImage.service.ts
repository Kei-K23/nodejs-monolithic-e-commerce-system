import mongoose from 'mongoose';
import { ProductImage } from '@/models/productImage.model';
import { NotFoundError } from '@/exceptions';

export class ProductImageService {
  static create = async ({
    imageUrl,
    productId,
    fileId,
  }: {
    imageUrl: string;
    productId: string;
    fileId: string;
  }) => {
    // When product create, also need to create inventory stock for that product
    const productImage = ProductImage.build({
      imageUrl,
      fileId,
      product: new mongoose.Types.ObjectId(productId),
    });
    await productImage.save();

    return productImage;
  };

  static getAll = async () => {
    return await ProductImage.find();
  };

  static getOneById = async (id: string) => {
    const product = await ProductImage.findById(id);
    if (!product) {
      throw new NotFoundError(`Product image with ID ${id} not found`);
    }
    return product;
  };

  static getAllByProductId = async (productId: string) => {
    return await ProductImage.find({
      product: productId,
    }).select(['imageUrl', 'id', 'createdAt', 'updatedAt']);
  };

  static update = async ({
    id,
    imageUrl,
    productId,
    fileId,
  }: {
    id: string;
    imageUrl: string;
    productId: string;
    fileId: string;
  }) => {
    const productImage = await ProductImage.findByIdAndUpdate(
      id,
      {
        imageUrl,
        fileId,
        product: new mongoose.Types.ObjectId(productId),
      },
      {
        new: true, // Return updated data
        runValidators: true,
        context: 'query',
      },
    );

    if (!productImage) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return productImage;
  };

  static delete = async (id: string) => {
    const productImage = await ProductImage.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!productImage) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
  };
}
