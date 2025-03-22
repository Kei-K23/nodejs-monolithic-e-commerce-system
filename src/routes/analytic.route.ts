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

router.get(
  '/sales-by-month',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getSalesByMonth),
);
router.get(
  '/sales-by-month/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadSalesByMonth),
);

router.get(
  '/top-selling-product',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getTopSellingProducts),
);
router.get(
  '/top-selling-product/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadTopSellingProducts),
);

router.get(
  '/customer-purchase-orders',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getCustomerPurchaseReport),
);
router.get(
  '/customer-purchase-orders/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadGetCustomerPurchaseReport),
);

export default router;
