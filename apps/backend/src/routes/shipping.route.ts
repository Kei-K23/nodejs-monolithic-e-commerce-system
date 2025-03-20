import ShippingController from '@/controllers/shipping.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  createShippingSchema,
  getShippingByIdSchema,
  updateShippingSchema,
} from '@/schemas/shipping.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createShippingSchema)],
  asyncHandler(ShippingController.newShipping),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(ShippingController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getShippingByIdSchema)],
  asyncHandler(ShippingController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getShippingByIdSchema),
    validate(updateShippingSchema),
  ],
  asyncHandler(ShippingController.editShipping),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getShippingByIdSchema)],
  asyncHandler(ShippingController.deleteShipping),
);

export default router;
