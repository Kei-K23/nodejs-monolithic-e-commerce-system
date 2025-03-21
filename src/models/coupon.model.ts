import mongoose from 'mongoose';

export interface ICoupon {
  code: string;
  discount: number; // Discount percentage
  usageLimit: number;
  usedCount?: number;
  validFrom: Date;
  validTo: Date;
}

interface CouponDocs extends ICoupon, mongoose.Document {}

interface CouponModelInterface extends mongoose.Model<CouponDocs> {
  build(attr: ICoupon): CouponDocs;
}

const CouponSchema = new mongoose.Schema<CouponDocs>(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'Coupon code is required'],
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const doc = await Coupon.findOne({ code: value });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
        message: 'Coupon code is already taken',
      },
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value > 0 && value <= 100;
        },
        message: 'Invalid discount',
      },
    },
    validFrom: {
      type: Date,
      required: [true, 'Coupon valid start date is required'],
    },
    validTo: {
      type: Date,
      required: [true, 'Coupon valid expire date is required'],
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      required: [true, 'Coupon usage limit is required'],
      default: 0,
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

CouponSchema.statics.build = (attr: ICoupon) => {
  return new Coupon(attr);
};

export const Coupon = mongoose.model<CouponDocs, CouponModelInterface>(
  'Coupon',
  CouponSchema,
);
