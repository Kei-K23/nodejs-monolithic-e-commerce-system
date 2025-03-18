import mongoose, { Types } from 'mongoose';

export enum PAYMENT_METHOD {
  CREDIT_CARD = 'CREDIT_CARD',
  STRIPE = 'STRIPE',
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface IPayment {
  user: Types.ObjectId;
  order: Types.ObjectId;
  paymentMethod: PAYMENT_METHOD;
  transactionId: string;
  amount: number;
  status: PAYMENT_STATUS;
}

interface PaymentDocs extends IPayment, mongoose.Document {}

interface PaymentModelInterface extends mongoose.Model<PaymentDocs> {
  build(attr: IPayment): PaymentDocs;
}

const PaymentSchema = new mongoose.Schema<PaymentDocs>(
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
    status: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: [
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.FAILED,
        PAYMENT_STATUS.PAID,
        PAYMENT_STATUS.REFUNDED,
      ],
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: [PAYMENT_METHOD.CREDIT_CARD, PAYMENT_METHOD.STRIPE],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const doc = await Payment.findOne({ transactionId: value });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 0;
        },
        message: 'Invalid amount',
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

PaymentSchema.statics.build = (attr: IPayment) => {
  return new Payment(attr);
};

export const Payment = mongoose.model<PaymentDocs, PaymentModelInterface>(
  'Payment',
  PaymentSchema,
);
