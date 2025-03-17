import CategoryController from '@/controllers/category.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  createUserSchema,
  getUserByIdSchema,
  updateUserSchema,
} from '@/schemas/user.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createUserSchema)],
  asyncHandler(CategoryController.newCategory),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(CategoryController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getUserByIdSchema)],
  validate(getUserByIdSchema),
  asyncHandler(CategoryController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getUserByIdSchema),
    validate(updateUserSchema),
  ],
  asyncHandler(CategoryController.editCategory),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getUserByIdSchema)],
  asyncHandler(CategoryController.deleteCategory),
);

export default router;
