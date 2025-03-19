import mongoose from 'mongoose';
import {
  Payment,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from '@/models/payment.model';

// user: Types.ObjectId;
// order: Types.ObjectId;
// paymentMethod: PAYMENT_METHOD;
// transactionId: string;
// amount: number;
// status: PAYMENT_STATUS;

export class PaymentService {
  static create = async (input: {
    userId: string;
    orderId: string;
    paymentMethod: PAYMENT_METHOD;
    transactionId: string;
    amount: number;
    status: PAYMENT_STATUS;
  }) => {
    // When product create, also need to create inventory stock for that product
    const payment = Payment.build({
      ...input,
      user: new mongoose.Types.ObjectId(input.userId),
      order: new mongoose.Types.ObjectId(input.orderId),
    });
    await payment.save();

    return payment;
  };
}
