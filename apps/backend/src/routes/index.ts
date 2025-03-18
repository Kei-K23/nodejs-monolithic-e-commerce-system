import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';
import inventoryRoutes from './inventory.route';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);
routes.use('/inventories', inventoryRoutes);

export default routes;
