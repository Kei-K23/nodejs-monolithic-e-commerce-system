import UserController from '@/controllers/user.controller';
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
  asyncHandler(UserController.newUser),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(UserController.listAll),
);
router.get(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getUserByIdSchema)],
  validate(getUserByIdSchema),
  asyncHandler(UserController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN]),
    validate(getUserByIdSchema),
    validate(updateUserSchema),
  ],
  asyncHandler(UserController.editUser),
);
router.delete(
  '/:id',
  [checkJWT, checkRoles([USER_ROLE.ADMIN]), validate(getUserByIdSchema)],
  asyncHandler(UserController.deleteUser),
);

export default router;
