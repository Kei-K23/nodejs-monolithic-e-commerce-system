import CouponController from '@/controllers/coupon.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  createCouponSchema,
  getCouponByIdSchema,
  updateCouponSchema,
} from '@/schemas/coupon.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createCouponSchema)],
  asyncHandler(CouponController.newCoupon),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(CouponController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getCouponByIdSchema)],
  asyncHandler(CouponController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getCouponByIdSchema),
    validate(updateCouponSchema),
  ],
  asyncHandler(CouponController.editCoupon),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getCouponByIdSchema)],
  asyncHandler(CouponController.deleteCoupon),
);

export default router;
