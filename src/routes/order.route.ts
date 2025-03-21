import logger from '@/config/logger.config';
import OrderController from '@/controllers/order.controller';
import { ApiError, NotFoundError } from '@/exceptions';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { ORDER_STATUS } from '@/models/order.model';
import { PAYMENT_STATUS } from '@/models/payment.model';
import { USER_ROLE } from '@/models/user.model';
import { createOrderSchema, getOrderByIdSchema } from '@/schemas/order.schema';
import { OrderService } from '@/services/order.service';
import { NextFunction, Request, Response, Router } from 'express';

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
