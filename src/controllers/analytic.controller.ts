import logger from '@/config/logger.config';
import { AnalyticService } from '@/services/analytic.service';
import { NextFunction, Request, Response } from 'express';

export default class AnalyticController {
  static getTotalSalesReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getTotalSalesReport();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadTotalSalesReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sales_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadTotalSalesReport(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getSalesByMonth = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getSalesByMonth();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadSalesByMonth = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sales_by_month_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadSalesByMonth(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getTopSellingProducts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getTopSellingProducts();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadTopSellingProducts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="top_selling_products_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadTopSellingProducts(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getCustomerPurchaseReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getCustomerPurchaseReport();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadGetCustomerPurchaseReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="customer_purchase_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadCustomerPurchaseReport(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getOrderStatusCounts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getOrderStatusCounts();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadOrderStatusCounts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="order_status_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadOrderStatusCounts(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getRevenueByOrderStatus = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getRevenueByOrderStatus();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadRevenueByOrderStatus = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="revenue_by_order_status_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadRevenueByOrderStatus(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getDailySalesReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getDailySalesReport();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadDailySalesReport = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="daily_sales_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadDailySalesReport(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getMonthlyGrowthRate = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getMonthlyGrowthRate();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadMonthlyGrowthRate = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="monthly_growth_rate_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadMonthlyGrowthRate(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getCategoryWiseSales = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getCategoryWiseSales();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadCategoryWiseSales = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="category_wise_sales_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadCategoryWiseSales(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static getMostProfitableProduct = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const report = await AnalyticService.getMostProfitableProduct();
      res.status(200).type('json').json(report);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  static downloadMostProfitableProduct = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="most_profitable_product_report.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');

      await AnalyticService.downloadMostProfitableProduct(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
