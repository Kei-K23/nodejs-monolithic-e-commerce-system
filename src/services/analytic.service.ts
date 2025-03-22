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

  static getSalesByMonth = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ]);

    return result;
  };

  static downloadSalesByMonth = async (res: Response) => {
    const result = await this.getSalesByMonth();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getTopSellingProducts = async () => {
    const result = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $project: {
          _id: 0,
          productName: '$productDetails.name',
          productId: '$productDetails._id',
          totalSold: 1,
        },
      },
      {
        $sort: { totalSold: -1 },
      },
    ]);

    return result;
  };

  static downloadTopSellingProducts = async (res: Response) => {
    const result = await this.getTopSellingProducts();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getCustomerPurchaseReport = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalSpent: 1,
          totalOrders: 1,
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
    ]);

    return result;
  };

  static downloadCustomerPurchaseReport = async (res: Response) => {
    const result = await this.getCustomerPurchaseReport();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };
}
