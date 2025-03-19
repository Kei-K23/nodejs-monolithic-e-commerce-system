import mongoose from 'mongoose';
import { InputOrder } from '@/schemas/order.schema';
import { Order } from '@/models/order.model';
import { ProductService } from './product.service';
import { ApiError, ClientError, NotFoundError } from '@/exceptions';
import { createStripeCheckoutSession } from '@/utils/stripe';
import { ProductImage } from '@/models/productImage.model';

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

    const newlyCreatedOrder = (await Order.findById(order.id)
      .populate({
        path: 'orderItems.product',
        select: 'id name price description', // Fetch only required fields
      })
      .lean()) as any;

    if (!newlyCreatedOrder) {
      throw new NotFoundError('Order not found');
    }

    const productIds = orderItems.map((oi) => oi.product).filter(Boolean);

    const productImages = await ProductImage.find({
      product: { $in: productIds }, // no need for `new mongoose.Types.ObjectId()`, since productIds are already ObjectId
    }).lean();

    // Normalize order items by adding product images
    const productImagesMap = productImages.reduce(
      (acc, image) => {
        acc[image.product._id.toString()] =
          acc[image.product._id.toString()] || [];
        acc[image.product._id.toString()].push(image.imageUrl);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Attach images to products in orderItems
    const newlyCreatedOrderItems = newlyCreatedOrder.orderItems.map(
      (oi: any) => ({
        ...oi,
        product: {
          ...oi.product,
          images: productImagesMap[oi.product._id.toString()] || [],
        },
      }),
    );

    // 3. Need to create payment
    // 4. Create stripe checkout
    const checkoutSessionRes = await createStripeCheckoutSession({
      userId: input.userId,
      orderId: order.id,
      orderItems: newlyCreatedOrderItems,
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
