import mongoose from 'mongoose';
import { Payment } from '@/models/payment.model';
import { NotFoundError } from '@/exceptions';
import { InputPayment } from '@/schemas/payment.schema';

export class PaymentService {
  static create = async (input: InputPayment) => {
    // When product create, also need to create inventory stock for that product
    const payment = Payment.build({
      ...input,
      user: new mongoose.Types.ObjectId(input.userId),
      order: new mongoose.Types.ObjectId(input.orderId),
    });
    await payment.save();

    return payment;
  };

  static getOneById = async (id: string) => {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }
    return payment;
  };

  static getAll = async () => {
    return await Payment.find();
  };
}
