import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';
import productImageRoutes from './productImage.route';
import inventoryRoutes from './inventory.route';
import orderRoutes from './order.route';
import reviewRoutes from './review.route';
import shippingRoutes from './shipping.route';
import couponRoutes from './coupon.route';
import couponUsageRoutes from './couponUsage.route';
import paymentRoutes from './payment.route';
import analyticRoutes from './analytic.route';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);
routes.use('/productImages', productImageRoutes);
routes.use('/inventories', inventoryRoutes);
routes.use('/orders', orderRoutes);
routes.use('/reviews', reviewRoutes);
routes.use('/shippings', shippingRoutes);
routes.use('/coupons', couponRoutes);
routes.use('/couponUsages', couponUsageRoutes);
routes.use('/payments', paymentRoutes);
routes.use('/analytics', analyticRoutes);

export default routes;
