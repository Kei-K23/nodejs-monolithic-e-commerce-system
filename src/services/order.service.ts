import mongoose from 'mongoose';
import { InputOrder } from '@/schemas/order.schema';
import { Order, OrderDocs } from '@/models/order.model';
import { ProductService } from './product.service';
import { ApiError, ClientError, NotFoundError } from '@/exceptions';
import { createStripeCheckoutSession } from '@/utils/stripe';

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

    const order = (await Order.create({
      totalQuantity,
      totalAmount,
      orderItems,
      user: new mongoose.Types.ObjectId(input.userId),
    })) as unknown as OrderDocs;

    const normalizedOrder = await this.getNormalizedOneOrder(order);
    console.log(normalizedOrder.orderItems);

    // 3. Need to create payment
    // 4. Create stripe checkout
    const checkoutSessionRes = await createStripeCheckoutSession({
      userId: input.userId,
      orderId: order.id,
      orderItems: normalizedOrder.orderItems,
      amount: totalAmount,
    });

    return { ...order.toJSON(), checkoutUrl: checkoutSessionRes.url };
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
