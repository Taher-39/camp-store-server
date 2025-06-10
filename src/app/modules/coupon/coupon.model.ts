// coupon.model.ts
import { Schema, model } from 'mongoose';
import { ICoupon, CouponModel } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 1 }, // Assuming discount is a fraction (0 to 1)
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

couponSchema.statics.isCouponValid = async function (
  code: string
): Promise<ICoupon | null> {
  const now = new Date();
  return this.findOne({
    code: code,
    isActive: true,
    $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }], // Either not expired or doesn't expire
  });
};

export const Coupon = model<ICoupon, CouponModel>('Coupon', couponSchema);