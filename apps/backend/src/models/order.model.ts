import mongoose, { Types } from 'mongoose';
import { PAYMENT_STATUS } from './payment.model';

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: Types.ObjectId;
  totalAmount: number;
  totalQuantity: number;
  orderStatus: ORDER_STATUS;
  paymentStatus: PAYMENT_STATUS;
  orderItems: IOrderItem[];
}

interface OrderItemDocs extends IOrderItem, mongoose.Document {}
interface OrderDocs extends IOrder, mongoose.Document {}

interface OrderModelInterface extends mongoose.Model<OrderDocs> {
  build(attr: IOrder): OrderDocs;
}

const orderItemSchema = new mongoose.Schema<OrderItemDocs>({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    validate: {
      validator: async function (value: number): Promise<boolean> {
        return value >= 0;
      },
      message: 'Invalid quantity',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    validate: {
      validator: async function (value: number): Promise<boolean> {
        return value >= 0;
      },
      message: 'Invalid price',
    },
  },
});

const orderSchema = new mongoose.Schema<OrderDocs>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 0;
        },
        message: 'Invalid total amount',
      },
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 0;
        },
        message: 'Invalid total quantity',
      },
    },
    orderStatus: {
      type: String,
      required: [true, 'Order status is required'],
      enum: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.SHIPPED,
      ],
      default: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
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
    orderItems: {
      type: [orderItemSchema],
      default: [],
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

export const Order = mongoose.model<OrderModelInterface>('Order', orderSchema);
