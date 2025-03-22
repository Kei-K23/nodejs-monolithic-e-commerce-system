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

      res.status(200).type('json').json({
        success: true,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
