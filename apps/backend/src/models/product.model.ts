import mongoose, { Types } from 'mongoose';

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
      maxlength: [150, 'Product name too long'],
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
      maxlength: [255, 'Product description too long'],
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

export const Product = mongoose.model<ProductDocs, ProductModelInterface>(
  'Product',
  ProductSchema,
);
