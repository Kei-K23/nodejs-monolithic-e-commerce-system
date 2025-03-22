import AnalyticController from '@/controllers/analytic.controller';
import { asyncHandler, checkJWT } from '@/middlewares';
import { checkRoles } from '@/middlewares/checkRoles.middleware';
import { USER_ROLE } from '@/models/user.model';
import { Router } from 'express';

const router = Router();

router.get(
  '/total-sales-report',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getTotalSalesReport),
);
router.get(
  '/total-sales-report/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadTotalSalesReport),
);

export default router;
