import { Order } from '@/models/order.model';
import { Response } from 'express';
import { format } from 'fast-csv';

export class AnalyticService {
  static getTotalSalesReport = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          avgOrderValue: 1,
        },
      },
    ]);

    return result[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
  };

  static downloadTotalSalesReport = async (res: Response) => {
    const salesReport = await this.getTotalSalesReport();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    csvStream.write(salesReport);
    csvStream.end();
  };
}
