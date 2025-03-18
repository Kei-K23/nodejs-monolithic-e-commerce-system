import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);

export default routes;
