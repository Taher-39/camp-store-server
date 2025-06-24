import { z } from 'zod';
import { ORDER_STATUS, Payment_Type } from '../user/user.constant';

// ✅ Order Item Schema
const orderItemSchema = z.object({
  name: z.string(),
  image: z.string(),
  price: z.number(),
  quantity: z.number(),
  productId: z.string(), // Should be ObjectId string
});
// ✅ Shipping Address Schema
const shippingAddressSchema = z.object({
  phone: z
    .string()
    .regex(/^01[3-9][0-9]{8}$/, 'Invalid Bangladeshi phone number'),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().optional(),
});

// ✅ Final Order Validation Schema
export const createOrderValidationSchema = z.object({
  body: z.object({
    // userId: z.string(),
    email: z.string().optional(),
    orderItems: z.array(orderItemSchema),
    name: z.string(),
    shippingAddress: shippingAddressSchema,
    couponCodeUsed: z.string().optional(),
    note: z.string().optional(),
    subtotal: z.number(),
    shipping: z.string().optional(),
    shippingCost: z.number(),
    totalPrice: z.number(),
    paymentMethod: z.nativeEnum(Payment_Type).default(Payment_Type.CASH_ON_DELIVERY),
    orderStatus: z.nativeEnum(ORDER_STATUS).default(ORDER_STATUS.PENDING),
  }),
});


export const orderUpdateValidationSchema = z.object({
  body: z.object({
    orderStatus: z.string().optional(), // Allow updating the order status
  }),
});
