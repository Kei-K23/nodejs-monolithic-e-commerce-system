import mongoose from 'mongoose';
import { InputOrder } from '@/schemas/order.schema';
import { Order, OrderDocs } from '@/models/order.model';
import { ProductService } from './product.service';
import { ApiError, ClientError, NotFoundError } from '@/exceptions';
import { createStripeCheckoutSession } from '@/utils/stripe';
import { CouponService } from './coupon.service';

export class OrderService {
  static create = async (input: InputOrder, couponCode?: string) => {
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

          totalAmount += isValidProduct.price * oi.quantity;
          totalQuantity += oi.quantity;
        }),
      );

      const orderItems = input.orderItems.map((oi) => ({
        quantity: oi.quantity,
        product: new mongoose.Types.ObjectId(oi.productId),
      }));

      const order = Order.build({
        totalQuantity,
        totalAmount,
        orderItems,
        user: new mongoose.Types.ObjectId(input.userId),
      }) as unknown as OrderDocs;
      await order.save();
      const normalizedOrder = await this.getNormalizedOneOrder(order);

      // If coupon code exist, then apply coupon and if coupon is valid make discount for total amount
      let discount = 0;
      if (couponCode) {
        const {
          success,
          message,
          discount: couponDiscount,
        } = await CouponService.applyCoupon({
          userId: input.userId,
          orderId: order.id,
          orderAmount: totalAmount,
          couponCode,
        });

        if (success) {
          // If apply coupon is successful, then update discount amount in order
          order.discountAmount = couponDiscount;
          discount = couponDiscount;
          await order.save();
        } else {
          throw new ApiError(message, 500);
        }
      }

      // 3. Need to create payment
      // 4. Create stripe checkout
      const checkoutSessionRes = await createStripeCheckoutSession({
        userId: input.userId,
        orderId: order.id,
        orderItems: normalizedOrder.orderItems,
        amount: totalAmount - discount,
      });

      return { ...order.toJSON(), checkoutUrl: checkoutSessionRes.url };
    } catch (error) {
      // Rollback Transaction on Failure
      if (error instanceof ClientError) {
        throw new ClientError(error.message);
      } else if (error instanceof ApiError) {
        throw new ApiError(error.message, error.statusCode);
      } else {
        throw new ApiError('Something went wrong when creating order');
      }
    }
  };

  static getOneById = async (id: string) => {
    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }
    return order;
  };

  static getAll = async () => {
    return await Order.find();
  };

  static getAllByUserId = async (userId: string) => {
    const orders = (await Order.find({ user: userId })) as OrderDocs[];

    const normalizedOrders = await this.getNormalizedOrders(orders);

    return normalizedOrders;
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

  static getNormalizedOrders = async (orders: OrderDocs[]) => {
    return await Promise.all(
      orders.map(async (order: OrderDocs) => {
        const newOrderItems = await Promise.all(
          order.orderItems.map(async (orderItem) => {
            const productWithImage = await ProductService.getOneByIdWithImages(
              orderItem.product._id.toString(),
            );

            return {
              product: {
                name: productWithImage.name,
                description: productWithImage.description,
                price: productWithImage.price,
                images: productWithImage.images,
              },
              quantity: orderItem.quantity,
            };
          }),
        );

        return {
          ...order.toJSON(),
          orderItems: newOrderItems,
        };
      }),
    );
  };

  static getNormalizedOneOrder = async (order: OrderDocs) => {
    const newOrderItems = await Promise.all(
      order.orderItems.map(async (orderItem) => {
        const productWithImage = await ProductService.getOneByIdWithImages(
          orderItem.product._id.toString(),
        );

        return {
          product: {
            name: productWithImage.name,
            description: productWithImage.description,
            price: productWithImage.price,
            images: productWithImage.images,
          },
          quantity: orderItem.quantity,
        };
      }),
    );

    return {
      ...order.toJSON(),
      orderItems: newOrderItems,
    };
  };
}
