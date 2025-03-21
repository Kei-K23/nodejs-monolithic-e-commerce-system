import ProductImageController from '@/controllers/productImage.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { getProductImageByIdSchema } from '@/schemas/productImage.schema';
import upload from '@/utils/upload';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), upload.single('image')],
  asyncHandler(ProductImageController.newProductImage),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER])],
  asyncHandler(ProductImageController.listAll),
);
router.get(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    validate(getProductImageByIdSchema),
  ],
  asyncHandler(ProductImageController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    upload.single('image'),
    validate(getProductImageByIdSchema),
  ],
  asyncHandler(ProductImageController.edit),
);
router.delete(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getProductImageByIdSchema),
  ],
  asyncHandler(ProductImageController.delete),
);

export default router;
