import OrderController from '@/controllers/order.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  couponCodeQuerySchema,
  createOrderSchema,
  getOrderByIdSchema,
} from '@/schemas/order.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [
    checkJWT,
    checkRoles([USER_ROLE.USER, USER_ROLE.ADMIN]),
    validate(createOrderSchema),
    validate(couponCodeQuerySchema),
  ],
  asyncHandler(OrderController.newOrder),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.USER, USER_ROLE.ADMIN])],
  asyncHandler(OrderController.listAll),
);
router.get(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.USER, USER_ROLE.ADMIN]),
    validate(getOrderByIdSchema),
  ],
  asyncHandler(OrderController.getOneById),
);

export default router;
