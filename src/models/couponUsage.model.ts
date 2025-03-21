import mongoose, { Types } from 'mongoose';

export interface ICouponUsage {
  user: Types.ObjectId;
  order: Types.ObjectId;
  coupon: Types.ObjectId;
  usedAt?: Date;
}

interface CouponUsageDocs extends ICouponUsage, mongoose.Document {}

interface CouponUsageModelInterface extends mongoose.Model<CouponUsageDocs> {
  build(attr: ICouponUsage): CouponUsageDocs;
}

const CouponUsageSchema = new mongoose.Schema<CouponUsageDocs>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    coupon: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    usedAt: {
      type: Date,
      default: new Date(),
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

CouponUsageSchema.statics.build = (attr: ICouponUsage) => {
  return new CouponUsage(attr);
};

export const CouponUsage = mongoose.model<
  CouponUsageDocs,
  CouponUsageModelInterface
>('CouponUsage', CouponUsageSchema);
