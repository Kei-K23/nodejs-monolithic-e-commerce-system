import mongoose from 'mongoose';
import { Review } from '@/models/review.model';
import { NotFoundError } from '@/exceptions';
import { InputReview } from '@/schemas/review.schema';

export class ReviewService {
  static create = async (userId: string, input: InputReview) => {
    // When review create, also need to create inventory stock for that review
    const review = Review.build({
      rating: input.rating,
      review: input.review,
      user: new mongoose.Types.ObjectId(userId),
      product: new mongoose.Types.ObjectId(input.productId),
    });
    await review.save();

    return review;
  };

  static getAll = async () => {
    return await Review.find();
  };

  static getOneById = async (id: string) => {
    const review = await Review.findById(id);
    if (!review) {
      throw new NotFoundError(`Review with ID ${id} not found`);
    }
    return review;
  };

  static update = async (id: string, userId: string, input: InputReview) => {
    const review = await Review.findByIdAndUpdate(id, input, {
      new: true, // Return updated data
      runValidators: true,
      context: 'query',
    });

    if (!review) {
      throw new NotFoundError(`Review with ID ${id} not found`);
    }

    return review;
  };

  static delete = async (id: string) => {
    const review = await Review.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      throw new NotFoundError(`Review with ID ${id} not found`);
    }
  };
}
