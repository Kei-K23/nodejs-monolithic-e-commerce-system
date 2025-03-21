import mongoose from 'mongoose';
import { CouponUsage } from '@/models/couponUsage.model';
import { InputCouponUsage } from '@/schemas/couponUsage.schema';
import { NotFoundError } from '@/exceptions';

export class CouponUsageService {
  static create = async (input: InputCouponUsage) => {
    // When product create, also need to create inventory stock for that product
    const couponUsage = CouponUsage.build({
      user: new mongoose.Types.ObjectId(input.userId),
      order: new mongoose.Types.ObjectId(input.orderId),
      coupon: new mongoose.Types.ObjectId(input.couponId),
    });
    await couponUsage.save();

    return couponUsage;
  };

  static getOneById = async (id: string) => {
    const couponUsage = await CouponUsage.findById(id);
    if (!couponUsage) {
      throw new NotFoundError(`Coupon usage with ID ${id} not found`);
    }
    return couponUsage;
  };

  static getAll = async () => {
    return await CouponUsage.find();
  };
}
