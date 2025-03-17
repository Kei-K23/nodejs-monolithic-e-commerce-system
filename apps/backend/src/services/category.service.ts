import { NotFoundError } from '@/exceptions';
import { ICategory, Category } from '@/models/category.model';

export class CategoryService {
  static newCategory = async (input: ICategory) => {
    const category = Category.build(input);
    await category.save();

    return category;
  };

  static getOneById = async (id: string) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
  };

  static getAll = async () => {
    return await Category.find();
  };

  static update = async (id: string, input: Partial<ICategory>) => {
    const category = await Category.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    return category;
  };

  static delete = async (id: string) => {
    const category = await Category.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }
  };
}
