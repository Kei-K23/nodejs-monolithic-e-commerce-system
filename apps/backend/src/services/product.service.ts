import { NotFoundError } from '@/exceptions';
import { IProduct, Product } from '@/models/product.model';
import { InventoryService } from './inventory.service';

export class ProductService {
  static newProduct = async (input: IProduct) => {
    // When product create, also need to create inventory stock for that product
    const product = Product.build(input);
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

  static getAll = async () => {
    return await Product.find();
  };

  static update = async (id: string, input: Partial<IProduct>) => {
    const product = await Product.findByIdAndUpdate(id, input, {
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

    await InventoryService.deleteByProductId(product.id);
  };
}
