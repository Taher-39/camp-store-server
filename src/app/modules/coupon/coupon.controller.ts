// coupon.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  createCouponService,
  getAllCouponsService,
  getCouponService,
  updateCouponService,
  deleteCouponService,
  isCouponValidService,
} from "./coupon.service";
import sendResponse from '../../utils/sendResponse';
import { ICoupon } from './coupon.interface';

export const createCouponCntrl = catchAsync(async (req, res) => {
  const result = await createCouponService(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Coupon created successfully!',
    data: result,
  });
});

export const getAllCouponsCntrl = catchAsync(async (req, res) => {
  const result = await getAllCouponsService();
  sendResponse<ICoupon[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons retrieved successfully!',
    data: result,
  });
});

export const getCouponCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getCouponService(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon retrieved successfully!',
    data: result,
  });
});

export const updateCouponCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCouponService(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon updated successfully!',
    data: result,
  });
});

export const deleteCouponCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteCouponService(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon deleted successfully!',
    data: null,
  });
});

export const isCouponValidController = catchAsync(async (req, res) => {
    const { code } = req.params;
    const coupon = await isCouponValidService(code);

    if (coupon) {
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Coupon is valid',
            data: {
                code: coupon.code,
                discountPercentage: coupon.discountPercentage
            }
        });
    } else {
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'Coupon is invalid or expired',
            data: null
        });
    }
});

