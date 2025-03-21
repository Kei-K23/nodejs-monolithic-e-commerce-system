import PaymentController from '@/controllers/payment.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { getPaymentByIdSchema } from '@/schemas/payment.schema';
import { Router } from 'express';

const router = Router();

router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(PaymentController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getPaymentByIdSchema)],
  asyncHandler(PaymentController.getOneById),
);

export default router;
