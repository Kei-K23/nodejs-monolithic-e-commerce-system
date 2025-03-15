import AuthController from '@/controllers/auth.controller';
import { asyncHandler, validate } from '@/middlewares';
import { createUserSchema, loginSchema } from '@/schemas/user.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(AuthController.login),
);
router.post(
  '/register',
  validate(createUserSchema),
  asyncHandler(AuthController.register),
);

export default router;
