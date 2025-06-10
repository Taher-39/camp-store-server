import { z } from 'zod';
import { Payment_Type } from '../user/user.constant';

export const createOrderValidationSchema = z.object({
  userId: z.string().optional(),
  orderItems: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      price: z.number(),
      quantity: z.number(),
      product: z.string(), // ObjectId
    }),
  ),
  name: z.string(),
  shippingAddress: z.object({
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string().optional(),
  }),
  couponCodeUsed: z.string().optional(),
  note: z.string().optional(),
  subtotal: z.number(),
  shipping: z.string().optional(),
  shippingCost: z.number(),
  totalPrice: z.number(),
  paymentMethod: z.nativeEnum(Payment_Type),
  orderStatus: z.string().optional(),
});

export const orderUpdateValidationSchema = z.object({
  body: z.object({
    orderStatus: z.string().optional(), // Allow updating the order status
  }),
});
