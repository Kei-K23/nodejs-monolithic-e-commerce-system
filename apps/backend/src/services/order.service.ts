import mongoose from 'mongoose';
import { InputOrder } from '@/schemas/order.schema';
import { Order } from '@/models/order.model';
import { ProductService } from './product.service';
import { ApiError, ClientError, NotFoundError } from '@/exceptions';

export class OrderService {
  static create = async (input: InputOrder) => {
    // 1. Need to check product have enough stock, don't need to check to inventory because inventory and product already sync
    let totalAmount = 0;
    let totalQuantity = 0;
    try {
      await Promise.all(
        input.orderItems.map(async (oi) => {
          const isValidProduct =
            await ProductService.checkProductQuantityIsValid(
              oi.productId,
              oi.quantity,
            );

          if (!isValidProduct) {
            throw new ClientError('Some product are out of stock');
          }
          await ProductService.update(oi.productId, {
            stockQuantity: isValidProduct.stockQuantity - oi.quantity,
          });

          // TODO When coupon or discount include, this is the place the add discount amount, I guest :)
          totalAmount += isValidProduct.price * oi.quantity;
          totalQuantity += oi.quantity;
        }),
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ClientError(error.message);
      } else {
        throw new ApiError('Something went wrong');
      }
    }

    const orderItems = input.orderItems.map((oi) => ({
      quantity: oi.quantity,
      product: new mongoose.Types.ObjectId(oi.productId),
    }));

    const order = await Order.create({
      totalQuantity,
      totalAmount,
      orderItems,
      user: new mongoose.Types.ObjectId(input.userId),
    });

    // 3. Implement payment setup

    return order;
  };

  static update = async (id: string, input: Partial<InputOrder>) => {
    const order = await Order.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    return order;
  };
}
