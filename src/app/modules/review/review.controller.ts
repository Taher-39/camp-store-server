import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  createReviewService,
  deleteReviewService,
  getAllReviewsService,
  getReviewsByProductService,
  getReviewsByUserService,
  updateReviewService,
} from './review.service';
import sendResponse from '../../utils/sendResponse';

export const createReviewCntrl = catchAsync(async (req, res) => {
  const review = await createReviewService(req.body, req.user._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully!',
    data: review,
  });
});

export const getProductReviewsCntrl = catchAsync(async (req, res) => {
  const reviews = await getReviewsByProductService(req.params.productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reviews retrieved successfully!',
    data: reviews,
  });
});

export const getUserReviewsCntrl = catchAsync(async (req, res) => {
  const reviews = await getReviewsByUserService(req.user._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Your reviews retrieved successfully!',
    data: reviews,
  });
});

export const updateReviewCntrl = catchAsync(async (req, res) => {
  const review = await updateReviewService(
    req.params.reviewId,
    req.body,
    req.user._id,
    req.user.role
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review updated successfully!',
    data: review,
  });
});

export const deleteReviewCntrl = catchAsync(async (req, res) => {
  const review = await deleteReviewService(
    req.params.reviewId,
    req.user._id,
    req.user.role
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully!',
    data: review,
  });
});

export const getAllReviewsCntrl = catchAsync(async (req, res) => {
  const reviews = await getAllReviewsService();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All reviews retrieved successfully!',
    data: reviews,
  });
});