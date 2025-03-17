import { NotFoundError } from '@/exceptions';
import { IInventory, Inventory } from '@/models/inventory.model';

export class InventoryService {
  static newInventory = async (input: IInventory) => {
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
}
