import { Review } from './review.model';
import httpStatus from 'http-status';
import { IReview } from './review.interface';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Order } from '../order/order.model';

export const createReviewService = async (payload: IReview, userId: string) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    productId: payload.productId,
    userId,
    isDeleted: false,
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already reviewed this product',
    );
  }

  // Check if user has any order
  const userOrders = await Order.find({ userId });
  if (userOrders.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not placed any order on our website. Please place an order before submitting a review.',
    );
  }

  // ✅ Check if user has ordered this specific product
  const hasOrderedProduct = await Order.findOne({
    userId,
    'orderItems.productId': payload.productId,
  });

  if (!hasOrderedProduct) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can only review products that you have ordered.',
    );
  }

  const review = await Review.create({
    ...payload,
    userId,
    isVerified: true,
  });

  return review;
};


export const getReviewsByProductService = async (productId: string) => {
  return await Review.find({ productId, isDeleted: false, isVerified: true })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });
};

export const getReviewsByUserService = async (userId: string) => {
  return await Review.find({ userId, isDeleted: false })
    .populate('productId', 'name images')
    .sort({ createdAt: -1 });
};

export const updateReviewService = async (
  reviewId: string,
  payload: Partial<IReview>,
  userId: string,
  role: string,
) => {
  const review = await Review.findById(reviewId);

  if (!review || review.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Only allow admin to update isVerified field
  if (payload.isVerified && role !== 'super-admin' && role !== 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Only admin can verify reviews');
  }

  // Only review owner or admin can update
  if (
    review.userId.toString() !== userId &&
    role !== 'super-admin' &&
    role !== 'admin'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own reviews',
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { ...payload },
    { new: true },
  );

  return updatedReview;
};

export const deleteReviewService = async (
  reviewId: string,
  userId: string,
  role: string,
) => {
  const review = await Review.findById(reviewId);

  if (!review || review.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Only review owner or admin can delete
  if (
    review.userId.toString() !== userId &&
    role !== 'super-admin' &&
    role !== 'admin'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own reviews',
    );
  }

  // Soft delete
  const deletedReview = await Review.findByIdAndUpdate(
    reviewId,
    { isDeleted: true },
    { new: true },
  );

  return deletedReview;
};

export const getAllReviewsService = async () => {
  return await Review.find({ isDeleted: false })
    .populate('productId', 'name')
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
};
