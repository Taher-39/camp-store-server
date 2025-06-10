// coupon.validation.ts
import { z } from 'zod';

export const couponCreateValidationSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    discountPercentage: z.number().min(0).max(1),
    expiresAt: z.string().optional(), // Could be a string in ISO format
    isActive: z.boolean().optional(),
  }),
});

export const couponUpdateValidationSchema = z.object({
  body: z.object({
    code: z.string().min(3).optional(),
    discountPercentage: z.number().min(0).max(1).optional(),
    expiresAt: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});