// coupon.route.ts
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  couponCreateValidationSchema,
  couponUpdateValidationSchema,
} from './coupon.validation';
import {
  createCouponCntrl,
  getAllCouponsCntrl,
  getCouponCntrl,
  updateCouponCntrl,
  deleteCouponCntrl,
  isCouponValidController,
} from './coupon.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR), // Adjust roles as needed
  validateRequest(couponCreateValidationSchema),
  createCouponCntrl
);

router.get('/', getAllCouponsCntrl);
router.get('/:id', getCouponCntrl);
router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR), // Adjust roles as needed
  validateRequest(couponUpdateValidationSchema),
  updateCouponCntrl
);
router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR), // Adjust roles as needed
  deleteCouponCntrl
);

router.get('/validate/:code', isCouponValidController);


export const CouponRoute = router;