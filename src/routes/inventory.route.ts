import InventoryController from '@/controllers/inventory.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  createInventorySchema,
  getInventoryByIdSchema,
  getInventoryByProductIdSchema,
  updateInventorySchema,
} from '@/schemas/inventory.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createInventorySchema)],
  asyncHandler(InventoryController.newInventory),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(InventoryController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getInventoryByIdSchema)],
  asyncHandler(InventoryController.getOneById),
);
router.get(
  '/productId/:productId',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getInventoryByProductIdSchema),
  ],
  asyncHandler(InventoryController.getOneByProductId),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getInventoryByIdSchema),
    validate(updateInventorySchema),
  ],
  asyncHandler(InventoryController.editInventory),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getInventoryByIdSchema)],
  asyncHandler(InventoryController.deleteInventory),
);

export default router;
