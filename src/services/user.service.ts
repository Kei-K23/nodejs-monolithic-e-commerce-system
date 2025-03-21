import { NotFoundError } from '@/exceptions/notFoundError';
import { IUser, User } from '@/models/user.model';

export class UserService {
  static create = async (input: IUser) => {
    // Build user document
    const user = User.build(input);
    // Save to database
    await user.save();
    return user;
  };

  static getAll = async () => {
    return await User.find();
  };

  static getOneById = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  };

  static update = async (id: string, input: Partial<IUser>) => {
    const user = await User.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return user;
  };

  static delete = async (id: string) => {
    const user = await User.findByIdAndDelete(id, {
      new: true,
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
  };
}
