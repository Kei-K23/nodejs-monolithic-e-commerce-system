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

  static getOrderStatusCounts = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          orderStatus: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result;
  };

  static downloadOrderStatusCounts = async (res: Response) => {
    const result = await this.getOrderStatusCounts();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getRevenueByOrderStatus = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          orderStatus: '$_id',
          totalRevenue: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    return result;
  };

  static downloadRevenueByOrderStatus = async (res: Response) => {
    const result = await this.getRevenueByOrderStatus();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getDailySalesReport = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrder: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalRevenue: 1,
          totalOrder: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    return result;
  };

  static downloadDailySalesReport = async (res: Response) => {
    const result = await this.getDailySalesReport();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getMonthlyGrowthRate = async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: '$createdAt',
            },
            month: {
              $month: '$createdAt',
            },
          },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrder: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          totalOrder: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    return result;
  };

  static downloadMonthlyGrowthRate = async (res: Response) => {
    const result = await this.getMonthlyGrowthRate();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getCategoryWiseSales = async () => {
    const result = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetail',
        },
      },
      { $unwind: '$productDetail' },
      {
        $lookup: {
          from: 'categories', // Join categories collection
          localField: 'productDetail.category', // category is an ObjectId
          foreignField: '_id',
          as: 'categoryDetail',
        },
      },
      { $unwind: '$categoryDetail' },
      {
        $group: {
          _id: '$categoryDetail.name', // Use category name instead of ObjectId
          totalRevenue: {
            $sum: {
              $multiply: ['$orderItems.quantity', '$productDetail.price'],
            },
          },
          totalSold: { $sum: '$orderItems.quantity' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalRevenue: 1,
          totalSold: 1,
        },
      },
    ]);

    return result;
  };

  static downloadCategoryWiseSales = async (res: Response) => {
    const result = await this.getCategoryWiseSales();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };

  static getMostProfitableProduct = async () => {
    const result = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetail',
        },
      },
      { $unwind: '$productDetail' },
      {
        $group: {
          _id: '$productDetail.name',
          totalRevenue: {
            $sum: {
              $multiply: ['$orderItems.quantity', '$productDetail.price'],
            },
          },
          totalSold: { $sum: '$orderItems.quantity' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      {
        $project: {
          _id: 0,
          productName: '$_id',
          totalRevenue: 1,
          totalSold: 1,
        },
      },
    ]);

    return result;
  };

  static downloadMostProfitableProduct = async (res: Response) => {
    const result = await this.getMostProfitableProduct();

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    result.forEach((r) => csvStream.write(r));

    csvStream.end();
  };
}
