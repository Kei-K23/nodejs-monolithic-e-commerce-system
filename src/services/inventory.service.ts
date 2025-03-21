import { NotFoundError } from '@/exceptions';
import { Inventory } from '@/models/inventory.model';
import { Product } from '@/models/product.model';
import { InputInventory } from '@/schemas/inventory.schema';
import mongoose from 'mongoose';

export class InventoryService {
  static getOneById = async (id: string) => {
    const inventory = await Inventory.findById(id).populate('product');
    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }
    return inventory;
  };

  static getOneByProductId = async (productId: string) => {
    const inventory = await Inventory.findOne({ product: productId }).populate(
      'product',
    );
    if (!inventory) {
      throw new NotFoundError(
        `Inventory with product ID ${productId} not found`,
      );
    }
    return inventory;
  };

  static getAll = async () => {
    return await Inventory.find();
  };

  static update = async (id: string, input: InputInventory) => {
    const inventory = await Inventory.findByIdAndUpdate(
      id,
      {
        ...input,
        product: new mongoose.Types.ObjectId(input.productId),
      },
      {
        new: true, // Return updated data
        runValidators: true,
        context: 'query',
      },
    );

    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }

    // Must update the product stock quantity here to be sync between inventory and product
    const product = await Product.findByIdAndUpdate(
      input.productId,
      {
        stockQuantity: input.stock,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return inventory;
  };

  static delete = async (id: string) => {
    const inventory = await Inventory.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }

    // When inventory delete, also update the related product stock to 0
    const product = await Product.findByIdAndUpdate(
      inventory.product,
      {
        stockQuantity: 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }
  };

  static deleteByProductId = async (productId: string) => {
    const inventory = await Inventory.findOneAndDelete(
      { product: productId },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!inventory) {
      throw new NotFoundError(
        `Inventory with product ID ${productId} not found`,
      );
    }

    // When inventory delete, also update the related product stock to 0
    const product = await Product.findByIdAndUpdate(
      inventory.product,
      {
        stockQuantity: 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }
  };

  static updateStockOrCreateNewOne = async ({
    productId,
    stock,
  }: {
    productId: string;
    stock: number;
  }) => {
    // Check inventory stock already exist for this product
    const inventory = await Inventory.findOne({ product: productId });
    // If inventory stock exist, then update the quantity, if not exist create new one
    if (!inventory) {
      const newInventory = Inventory.build({
        product: new mongoose.Types.ObjectId(productId),
        stock: stock,
      });
      await newInventory.save();
    } else {
      inventory.stock = stock;
      await inventory.save();
    }

    // Must update the product stock quantity here to be sync between inventory and product
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    product.stockQuantity = stock;
    await product.save();
  };
}
