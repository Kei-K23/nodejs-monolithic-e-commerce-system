import CategoryController from '@/controllers/category.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  createCategorySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from '@/schemas/category.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createCategorySchema)],
  asyncHandler(CategoryController.newCategory),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(CategoryController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getCategoryByIdSchema)],
  asyncHandler(CategoryController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getCategoryByIdSchema),
    validate(updateCategorySchema),
  ],
  asyncHandler(CategoryController.editCategory),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getCategoryByIdSchema)],
  asyncHandler(CategoryController.deleteCategory),
);

export default router;
