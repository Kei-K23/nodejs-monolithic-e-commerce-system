import { envConfig } from '@/config/env.config';
import Stripe from 'stripe';

// Set up Stripe instance
const stripe = new Stripe(envConfig.stripe.secret, {
  apiVersion: '2025-02-24.acacia',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStripeCheckoutSession = async ({
  userId,
  orderId,
  orderItems,
  amount,
}: {
  orderId: string;
  userId: string;
  orderItems: any;
  amount: number;
}) => {
  // Prepare line items for Stripe Checkout with images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems = orderItems.map((item: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        images: item.product.images ?? [],
      },
      unit_amount: item.product.price * 100,
    },
    quantity: item.quantity,
  }));

  // Create a Stripe Checkout session
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${envConfig.app.url}/order-success?orderId=${orderId}`,
    cancel_url: `${envConfig.app.url}/order-cancel?orderId=${orderId}`,
    metadata: {
      userId,
      orderId,
      amount,
    },
  });
};
