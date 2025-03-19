import mongoose, { Types } from 'mongoose';

export interface IReview {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  review: string;
}

interface ReviewDocs extends IReview, mongoose.Document {}

interface ReviewModelInterface extends mongoose.Model<ReviewDocs> {
  build(attr: IReview): ReviewDocs;
}

const ReviewSchema = new mongoose.Schema<ReviewDocs>(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
      minlength: [5, 'Review is too short'],
      trim: true,
      maxlength: [255, 'Review is too long'],
    },
    rating: {
      type: Number,
      required: [true, 'Review rating is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 1 && value <= 5;
        },
        message: 'Invalid rating',
      },
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

ReviewSchema.statics.build = (attr: IReview) => {
  return new Review(attr);
};

ReviewSchema.index({ user: 1 });
ReviewSchema.index({ product: 1 });

export const Review = mongoose.model<ReviewDocs, ReviewModelInterface>(
  'Review',
  ReviewSchema,
);
