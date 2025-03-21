import { envConfig } from '@/config/env.config';
import Stripe from 'stripe';

// Set up Stripe instance
const stripe = new Stripe(envConfig.stripe.secret, {
  apiVersion: '2025-02-24.acacia',
});

export const createStripeCheckoutSession = async ({
  userId,
  orderId,
  orderItems,
  amount,
  discountPercentage,
  discountSuccess,
}: {
  orderId: string;
  userId: string;
  orderItems: any;
  amount: number;
  discountPercentage?: number;
  discountSuccess: boolean;
}) => {
  // Prepare line items for Stripe Checkout with images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems = orderItems.map((item: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        images:
          item.product.images
            .map((image: any) => image.imageUrl)
            .filter(Boolean) ?? [],
      },
      unit_amount: item.product.price * 100,
    },
    quantity: item.quantity,
  }));

  let coupon;
  if (discountSuccess) {
    coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: 'once',
    });
  }

  // Create a Stripe Checkout session
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${envConfig.app.url}/api/v1/webhooks/order-success?orderId=${orderId}`,
    cancel_url: `${envConfig.app.url}/api/v1/webhooks/order-cancel?orderId=${orderId}`,
    metadata: {
      userId,
      orderId,
      amount,
    },
    discounts: [discountSuccess ? { coupon: coupon?.id } : {}],
  });
};

export default stripe;
