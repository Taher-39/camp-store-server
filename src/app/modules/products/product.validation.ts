import { z } from 'zod';

export const ProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    description: z.string({ required_error: 'Product description is required' }),
    category: z.string({ required_error: 'Product category is required' }),
    price: z
      .number({ required_error: 'Product price is required' })
      .nonnegative(),
    status: z.string({ required_error: 'Product status is required' }),
    quantity: z.number({ required_error: 'Product quantity is required' }).nonnegative(),
    image: z.string().optional(),
  }),
});

export const ProductUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    productId: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number().nonnegative().optional(),
    status: z.string().optional(),
    image: z.string().optional(),
    quantity: z.number().optional(),
  }),
});

export const updateSalesAndStockValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    ).nonempty('Products array must not be empty'),
  }),
});

