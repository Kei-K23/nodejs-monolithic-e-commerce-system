import { NotFoundError } from '@/exceptions';
import { IInventory, Inventory } from '@/models/inventory.model';
import mongoose from 'mongoose';

export class InventoryService {
  static create = async (input: IInventory) => {
    const inventory = Inventory.build(input);
    await inventory.save();

    return inventory;
  };

  static getOneById = async (id: string) => {
    const inventory = await Inventory.findById(id);
    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }
    return inventory;
  };

  static getAll = async () => {
    return await Inventory.find();
  };

  static update = async (id: string, input: Partial<IInventory>) => {
    const inventory = await Inventory.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
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
  };
}
