import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  reviewCreateValidationSchema,
  reviewUpdateValidationSchema,
} from './review.validation';
import {
  createReviewCntrl,
  deleteReviewCntrl,
  getAllReviewsCntrl,
  getProductReviewsCntrl,
  getUserReviewsCntrl,
  updateReviewCntrl,
} from './review.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(reviewCreateValidationSchema),
  createReviewCntrl
);

router.get(
  '/product/:productId',
  getProductReviewsCntrl
);

router.get(
  '/me',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  getUserReviewsCntrl
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  getAllReviewsCntrl
);

router.patch(
  '/:reviewId',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(reviewUpdateValidationSchema),
  updateReviewCntrl
);

router.delete(
  '/:reviewId',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  deleteReviewCntrl
);

export const ReviewRoute = router;