import { NotFoundError } from '@/exceptions';
import { Coupon } from '@/models/coupon.model';
import { InputCoupon } from '@/schemas/coupon.schema';

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
}
