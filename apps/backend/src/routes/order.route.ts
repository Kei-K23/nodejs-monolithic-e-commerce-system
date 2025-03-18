import OrderController from '@/controllers/order.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { createOrderSchema } from '@/schemas/order.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [
    checkJWT,
    checkRoles([USER_ROLE.USER, USER_ROLE.ADMIN]),
    validate(createOrderSchema),
  ],
  asyncHandler(OrderController.newOrder),
);

export default router;
