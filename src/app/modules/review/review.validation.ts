import { z } from 'zod';

export const reviewCreateValidationSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(3, 'Comment must be at least 3 characters').max(1000, 'Comment too long'),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

export const reviewUpdateValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5').optional(),
    comment: z.string().min(3, 'Comment must be at least 3 characters').max(1000, 'Comment too long').optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    isVerified: z.boolean().optional(),
  }),
});