import ReviewController from '@/controllers/review.controller';
import { asyncHandler, checkJWT, validate } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { getReviewByIdSchema } from '@/schemas/review.schema';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER])],
  asyncHandler(ReviewController.newReview),
);
router.get(
  '/',
  [checkJWT, checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER])],
  asyncHandler(ReviewController.listAll),
);
router.get(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    validate(getReviewByIdSchema),
  ],
  asyncHandler(ReviewController.getOneById),
);
router.patch(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    validate(getReviewByIdSchema),
  ],
  asyncHandler(ReviewController.edit),
);
router.delete(
  '/:id',
  [
    checkJWT,
    checkRoles([USER_ROLE.ADMIN, USER_ROLE.USER]),
    validate(getReviewByIdSchema),
  ],
  asyncHandler(ReviewController.delete),
);

export default router;
