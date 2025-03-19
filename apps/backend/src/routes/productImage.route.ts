import ProductImageController from '@/controllers/productImage.controller';
import { asyncHandler, checkJWT } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import upload from '@/utils/upload';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    upload.single('image'),
  ],
  asyncHandler(ProductImageController.newProductImage),
);

export default router;
