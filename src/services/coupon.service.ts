import { NotFoundError } from '@/exceptions';
import { Coupon } from '@/models/coupon.model';
import { InputCoupon } from '@/schemas/coupon.schema';
import { CouponUsageService } from './couponUsage.service';

export class CouponService {
  static create = async (input: InputCoupon) => {
    // When product create, also need to create inventory stock for that product
    const coupon = Coupon.build({
      code: crypto.randomUUID().toString(),
      ...input,
    });
    await coupon.save();
    return coupon;
  };

  static getOneById = async (id: string) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }
    return coupon;
  };

  static getOneByCode = async (code: string) => {
    return await Coupon.findOne({ code });
  };

  static getAll = async () => {
    return await Coupon.find();
  };

  static update = async (id: string, input: Partial<InputCoupon>) => {
    const coupon = await Coupon.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!coupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }

    return coupon;
  };

  static delete = async (id: string) => {
    const coupon = await Coupon.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }
  };

  // TODO When apply coupon success, then create coupon usage and increment usage in coupon
  static applyCoupon = async ({
    userId,
    orderId,
    couponCode,
    orderAmount,
  }: {
    userId: string;
    orderId: string;
    orderAmount: number;
    couponCode: string;
  }) => {
    const coupon = await this.getOneByCode(couponCode);

    if (!coupon) {
      return {
        success: false,
        message: 'Invalid coupon',
        discount: 0,
      };
    }

    if (new Date(coupon.validTo) < new Date()) {
      return {
        success: false,
        message: 'Coupon is already expire',
        discount: 0,
      };
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return {
        success: false,
        message: 'Coupon usage limit reached',
        discount: 0,
      };
    }

    const existingCouponUsage = await CouponUsageService.getOneWithCondition({
      userId,
      couponCode,
    });

    if (existingCouponUsage) {
      return {
        success: false,
        message: 'Coupon already used by this user',
        discount: 0,
      };
    }

    // Create coupon usage
    const couponUsage = await CouponUsageService.create({
      orderId: orderId,
      userId: userId,
      couponId: coupon.id,
    });

    if (!couponUsage) {
      return {
        success: false,
        message: 'Error when creating coupon usage',
        discount: 0,
      };
    }
    if (coupon.usedCount !== undefined) {
      // Increment coupon used count
      coupon.usedCount = coupon.usedCount + 1;
      await coupon.save();
    }

    return {
      success: true,
      message: 'Successfully applied the coupon for this order',
      discount: orderAmount / coupon.discount,
    };
  };
}
