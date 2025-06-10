import { Coupon } from './coupon.model';
import { ICoupon } from './coupon.interface';

export const createCouponService = async (payload: ICoupon): Promise<ICoupon> => {
  return await Coupon.create(payload);
};

export const getAllCouponsService = async (): Promise<ICoupon[]> => {
  return await Coupon.find();
};

export const getCouponService = async (id: string): Promise<ICoupon | null> => {
  return await Coupon.findById(id);
};

export const updateCouponService = async (
  id: string,
  payload: Partial<ICoupon>
): Promise<ICoupon | null> => {
  return await Coupon.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCouponService = async (id: string): Promise<void> => {
  await Coupon.findByIdAndDelete(id);
};

export const isCouponValidService = async (code: string): Promise<ICoupon | null> => {
    return Coupon.isCouponValid(code);
};