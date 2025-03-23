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

router.get(
  '/order-status-count',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getOrderStatusCounts),
);
router.get(
  '/order-status-count/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadOrderStatusCounts),
);

router.get(
  '/revenue-by-order-status',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getRevenueByOrderStatus),
);
router.get(
  '/revenue-by-order-status/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadRevenueByOrderStatus),
);

router.get(
  '/daily-sales-report',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getDailySalesReport),
);
router.get(
  '/daily-sales-report/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadDailySalesReport),
);

router.get(
  '/monthly-growth-rate',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getMonthlyGrowthRate),
);
router.get(
  '/monthly-growth-rate/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadMonthlyGrowthRate),
);

router.get(
  '/category-wise-sales',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getCategoryWiseSales),
);
router.get(
  '/category-wise-sales/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadCategoryWiseSales),
);

router.get(
  '/most-profitable-products',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.getMostProfitableProduct),
);
router.get(
  '/most-profitable-products/download',
  [checkJWT, checkRoles([USER_ROLE.ADMIN])],
  asyncHandler(AnalyticController.downloadMostProfitableProduct),
);

export default router;
