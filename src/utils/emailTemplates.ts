export default {
  orderConfirmation: ({
    customerName,
    orderId,
    orderItems,
    orderTotal,
  }: {
    customerName: string;
    orderId: string;
    orderItems: string[];
    orderTotal: number;
  }) => `
    <h2>Order Confirmation</h2>
    <p>Hello ${customerName},</p>
    <p>Thank you for your order! Your order <strong>#${orderId}</strong> has been successfully placed.</p>
    <p><strong>Order Details:</strong></p>
    <ul>
      ${orderItems.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <p><strong>Total Amount:</strong> ${orderTotal}</p>
    <p>We will notify you once your order is shipped.</p>
    <p>Best regards,<br><strong>Your Store Team</strong></p>
  `,

  paymentSuccess: ({
    customerName,
    orderId,
    orderTotal,
  }: {
    customerName: string;
    orderId: string;
    orderTotal: number;
  }) => `
    <h2>Payment Successful</h2>
    <p>Hi ${customerName},</p>
    <p>We have received your payment of <strong>${orderTotal}</strong> for order <strong>#${orderId}</strong>.</p>
    <p>Your order is now being processed, and we will update you once it's shipped.</p>
    <p>Best regards,<br><strong>Your Store Team</strong></p>
  `,

  orderShipped: ({
    customerName,
    orderId,
    trackingNumber,
    deliveryDate,
  }: {
    customerName: string;
    orderId: string;
    trackingNumber: string;
    deliveryDate: Date;
  }) => `
    <h2>Your Order is on the Way!</h2>
    <p>Hello ${customerName},</p>
    <p>Your order <strong>#${orderId}</strong> has been shipped.</p>
    <p><strong>Tracking Details:</strong></p>
    <ul>
      <li>Tracking Number: ${trackingNumber}</li>
      <li>Estimated Delivery: ${deliveryDate}</li>
    </ul>
    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br><strong>Your Store Team</strong></p>
  `,
};
