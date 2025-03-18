import ProductController from '@/controllers/product.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import {
  getProductByIdSchema,
  updateProductSchema,
} from '@/schemas/product.schema';
import { createProductSchema } from '@/schemas/product.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(createProductSchema)],
  asyncHandler(ProductController.newProduct),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER])],
  asyncHandler(ProductController.listAll),
);
router.get(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    validate(getProductByIdSchema),
  ],
  asyncHandler(ProductController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getProductByIdSchema),
    validate(updateProductSchema),
  ],
  asyncHandler(ProductController.editProduct),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getProductByIdSchema)],
  asyncHandler(ProductController.deleteProduct),
);

export default router;
