import { NotFoundError } from '@/exceptions';
import { Product } from '@/models/product.model';
import { InventoryService } from './inventory.service';
import mongoose from 'mongoose';
import { InputProduct } from '@/schemas/product.schema';
import { Inventory } from '@/models/inventory.model';
import { ProductImageService } from './productImage.service';

export class ProductService {
  static create = async (input: InputProduct) => {
    // When product create, also need to create inventory stock for that product
    const product = Product.build({
      ...input,
      category: new mongoose.Types.ObjectId(input.categoryId),
    });
    await product.save();

    // Check inventory stock already exist for this product
    await InventoryService.updateStockOrCreateNewOne({
      productId: product.id,
      stock: product.stockQuantity,
    });

    return product;
  };

  static getOneById = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  };

  static getOneByIdWithImages = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    const images = await ProductImageService.getAllByProductId(product.id);

    return { ...product.toJSON(), images: images ?? [] };
  };

  static getAll = async () => {
    return await Product.find();
  };

  static update = async (id: string, input: Partial<InputProduct>) => {
    const updateData: Record<string, any> = { ...input };
    if (input?.categoryId) {
      updateData.category = new mongoose.Types.ObjectId(input.categoryId);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    // Check inventory stock already exist for this product
    await InventoryService.updateStockOrCreateNewOne({
      productId: product.id,
      stock: product.stockQuantity,
    });

    return product;
  };

  static delete = async (id: string) => {
    const product = await Product.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    const inventory = await InventoryService.getOneByProductId(product.id);
    if (inventory) {
      const deletedInventory = await Inventory.findByIdAndDelete(inventory.id, {
        new: true,
      });
      if (!deletedInventory) {
        throw new NotFoundError(`Inventory not found`);
      }
    }
  };

  static checkProductQuantityIsValid = async (id: string, quantity: number) => {
    const product = await Product.findOne({
      _id: new mongoose.Types.ObjectId(id),
      stockQuantity: {
        $gte: quantity,
      },
    }).select(['_id', 'stockQuantity', 'price']);

    if (product) {
      return product;
    } else {
      return null;
    }
  };
}
