import mongoose, { Types } from 'mongoose';

export enum SHIPPING_STATUS {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface IShipping {
  order: Types.ObjectId;
  user: Types.ObjectId;
  address: string;
  trackingNumber: string;
  status: SHIPPING_STATUS;
  estimatedDeliveryDate: Date;
}

interface ShippingDocs extends IShipping, mongoose.Document {}

interface ShippingModelInterface extends mongoose.Model<ShippingDocs> {
  build(attr: IShipping): ShippingDocs;
}

const ShippingSchema = new mongoose.Schema<ShippingDocs>(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Shipping address is too short'],
      maxlength: [500, 'Shipping address is too long'],
    },
    trackingNumber: {
      type: String,
      required: [true, 'Tracking number is required'],
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const doc = await Shipping.findOne({ trackingNumber: value });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
        message: 'Tracking number is already taken',
      },
    },
    estimatedDeliveryDate: {
      type: Date,
      required: [true, 'Estimated delivery date is required'],
    },
    status: {
      type: String,
      required: [true, 'Shipping status is required'],
      enum: [
        SHIPPING_STATUS.PENDING,
        SHIPPING_STATUS.DELIVERED,
        SHIPPING_STATUS.RETURNED,
        SHIPPING_STATUS.SHIPPED,
      ],
      default: SHIPPING_STATUS.PENDING,
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

ShippingSchema.statics.build = (attr: IShipping) => {
  return new Shipping(attr);
};

export const Shipping = mongoose.model<ShippingDocs, ShippingModelInterface>(
  'Shipping',
  ShippingSchema,
);
