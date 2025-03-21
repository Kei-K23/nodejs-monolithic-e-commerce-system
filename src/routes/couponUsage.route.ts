import CouponUsageController from '@/controllers/couponUsage.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { getCouponUsageByIdSchema } from '@/schemas/couponUsage.schema';
import { Router } from 'express';

const router = Router();

router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(CouponUsageController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getCouponUsageByIdSchema)],
  asyncHandler(CouponUsageController.getOneById),
);

export default router;
