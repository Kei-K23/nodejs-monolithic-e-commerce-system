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
}
