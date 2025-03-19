import mongoose from 'mongoose';
import { ProductImage } from '@/models/productImage.model';

export class ProductImageService {
  static create = async ({
    imageUrl,
    productId,
  }: {
    imageUrl: string;
    productId: string;
  }) => {
    // When product create, also need to create inventory stock for that product
    const productImage = ProductImage.build({
      imageUrl,
      product: new mongoose.Types.ObjectId(productId),
    });
    await productImage.save();

    return productImage;
  };
}
