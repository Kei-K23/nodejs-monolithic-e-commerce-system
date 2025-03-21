import mongoose, { Types } from 'mongoose';
import { ProductImage } from './productImage.model';
import { deleteFile } from '@/utils/upload';
import { Review } from './review.model';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: Types.ObjectId;
}

interface ProductDocs extends IProduct, mongoose.Document {}

interface ProductModelInterface extends mongoose.Model<ProductDocs> {
  build(attr: IProduct): ProductDocs;
}

const ProductSchema = new mongoose.Schema<ProductDocs>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name too short'],
      maxlength: [255, 'Product name too long'],
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const doc = await Product.findOne({ name: value });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
        message: 'Product name is already taken',
      },
    },
    description: {
      type: String,
      minlength: [10, 'Product description too short'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value > 0;
        },
        message: 'Invalid product price',
      },
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 0;
        },
        message: 'Invalid stock quantity price',
      },
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Category id is required'],
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

// Handle product related product images deleting when making delete to product
ProductSchema.pre('findOneAndDelete', async function (next) {
  // this.getFilter() means, when we call findOneAndDelete, when have to pass id as condition that condition is this.getFilter()
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    const productImages = await ProductImage.find({
      product: doc._id,
    }).select(['fileId', 'id']);
    const productReviews = await Review.find({
      product: doc._id,
    }).select('id');

    if (productImages.length > 0) {
      await Promise.all(
        productImages.map(async (pi) => {
          // Delete product image and also in the uploaded image from imagekit
          await pi.deleteOne({ _id: pi.id });
          await deleteFile(pi.fileId);
        }),
      );
    }

    if (productReviews.length > 0) {
      await Promise.all(
        productReviews.map(async (pr) => {
          await pr.deleteOne({ _id: pr.id });
        }),
      );
    }
  }

  next();
});

ProductSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const productId = this._id;
    const productImages = await ProductImage.find({
      product: productId,
    }).select(['fileId', 'id']);

    const productReviews = await Review.find({
      product: productId,
    }).select('id');

    if (productImages.length > 0) {
      await Promise.all(
        productImages.map(async (pi) => {
          // Delete product image and also in the uploaded image from imagekit
          await pi.deleteOne({ _id: pi.id });
          await deleteFile(pi.fileId);
        }),
      );
    }

    if (productReviews.length > 0) {
      await Promise.all(
        productReviews.map(async (pr) => {
          await pr.deleteOne({ _id: pr.id });
        }),
      );
    }

    next();
  },
);

ProductSchema.statics.build = (attr: IProduct) => {
  return new Product(attr);
};

export const Product = mongoose.model<ProductDocs, ProductModelInterface>(
  'Product',
  ProductSchema,
);
