// coupon.interface.ts
import { Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface CouponModel extends Model<ICoupon> {
  isCouponValid(code: string): Promise<ICoupon | null>;
}