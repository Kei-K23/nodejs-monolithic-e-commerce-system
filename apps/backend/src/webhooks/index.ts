import { envConfig } from '@/config/env.config';
import logger from '@/config/logger.config';
import { NotFoundError } from '@/exceptions';
import { asyncHandler } from '@/middlewares';
import { Order, ORDER_STATUS } from '@/models/order.model';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/models/payment.model';
import { PaymentService } from '@/services/payment.service';
import { NextFunction, Request, Response, Router } from 'express';
import Stripe from 'stripe';

const routes = Router();

routes.post(
  '/stripe',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = req.headers['stripe-signature']!;
      const endpointSecret = envConfig.stripe.webSecret;
      // Explicitly Convert req.body to a Buffer
      const payload = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body));

      const event = Stripe.webhooks.constructEvent(
        payload,
        sig,
        endpointSecret,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve the subscription ID from metadata
        const { userId, orderId, amount } = session.metadata as unknown as {
          userId: string;
          orderId: string;
          amount: number;
        };

        // Update order status
        const order = await Order.findByIdAndUpdate(
          orderId,
          {
            orderStatus: ORDER_STATUS.PROCESSING,
            paymentStatus: PAYMENT_STATUS.PAID,
          },
          {
            new: true,
            runValidators: true,
          },
        );

        if (!order) {
          throw new NotFoundError(`Order with ID ${orderId} not found`);
        }

        await PaymentService.create({
          userId,
          orderId,
          amount,
          status: PAYMENT_STATUS.PAID,
          transactionId: session.payment_intent as string,
          paymentMethod: PAYMENT_METHOD.STRIPE,
        });

        res.status(200).type('json').send({
          status: 'success',
          message: 'Checkout payment processed successfully',
        });
      } else {
        res.status(200).send({
          status: 'success',
          message: 'Event received',
        });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }),
);

export default routes;
