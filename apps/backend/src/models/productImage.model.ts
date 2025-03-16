import mongoose, { Types } from 'mongoose';

export interface IProductImage {
  product: Types.ObjectId;
  imageUrl: string;
}

interface ProductImageDocs extends IProductImage, mongoose.Document {}

interface ProductModelInterface extends mongoose.Model<ProductImageDocs> {
  build(attr: IProductImage): ProductImageDocs;
}

const productImageSchema = new mongoose.Schema<ProductImageDocs>(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image url is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

export const ProductImage = mongoose.model<
  ProductImageDocs,
  ProductModelInterface
>('ProductImage', productImageSchema);
