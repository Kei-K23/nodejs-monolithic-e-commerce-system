import { NotFoundError } from '@/exceptions';
import { Shipping, SHIPPING_STATUS } from '@/models/shipping.model';
import mongoose from 'mongoose';
import { InputShipping } from '@/schemas/shipping.schema';
import { OrderService } from './order.service';
import { ORDER_STATUS } from '@/models/order.model';

export class ShippingService {
  static create = async (input: InputShipping) => {
    // When product create, also need to create inventory stock for that product
    const shipping = Shipping.build({
      ...input,
      trackingNumber: crypto.randomUUID().toString(),
      user: new mongoose.Types.ObjectId(input.userId),
      order: new mongoose.Types.ObjectId(input.orderId),
    });
    await shipping.save();

    // Update Order status to shipping
    await OrderService.update(input.orderId, {
      orderStatus: ORDER_STATUS.DELIVERED,
    });

    return shipping;
  };

  static getOneById = async (id: string) => {
    const shipping = await Shipping.findById(id);
    if (!shipping) {
      throw new NotFoundError(`Shipping with ID ${id} not found`);
    }
    return shipping;
  };

  static getAll = async () => {
    return await Shipping.find();
  };

  static update = async (id: string, input: Partial<InputShipping>) => {
    const updateData: Record<string, any> = { ...input };
    if (input?.orderId) {
      updateData.order = new mongoose.Types.ObjectId(input.orderId);
    }
    if (input?.userId) {
      updateData.user = new mongoose.Types.ObjectId(input.userId);
    }

    const shipping = await Shipping.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!shipping) {
      throw new NotFoundError(`Shipping with ID ${id} not found`);
    }

    let orderStatus: ORDER_STATUS;
    switch (updateData.status) {
      case SHIPPING_STATUS.DELIVERED:
        orderStatus = ORDER_STATUS.DELIVERED;
        break;
      case SHIPPING_STATUS.SHIPPED:
        orderStatus = ORDER_STATUS.SHIPPED;
        break;
      case SHIPPING_STATUS.RETURNED:
        orderStatus = ORDER_STATUS.RETURNED;
        break;
      default:
        orderStatus = ORDER_STATUS.PENDING;
        break;
    }

    // Update Order status
    await OrderService.update(input.orderId!, {
      orderStatus,
    });

    return shipping;
  };

  static delete = async (id: string) => {
    const shipping = await Shipping.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!shipping) {
      throw new NotFoundError(`Shipping with ID ${id} not found`);
    }
  };
}
