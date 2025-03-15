import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  description: string;
}

interface CategoryDocs extends ICategory, mongoose.Document {}

interface CategoryModelInterface extends mongoose.Model<CategoryDocs> {
  build(attr: ICategory): CategoryDocs;
}

const categorySchema = new mongoose.Schema<CategoryDocs>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [3, 'Category name too short'],
      maxlength: [150, 'Category name too long'],
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const doc = await Category.findOne({ name: value });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
      },
      message: 'Category name is already taken',
    },
    description: {
      type: String,
      minlength: [10, 'Category description too short'],
      maxlength: [255, 'Category description too long'],
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

export const Category = mongoose.model<CategoryDocs, CategoryModelInterface>(
  'Category',
  categorySchema,
);
