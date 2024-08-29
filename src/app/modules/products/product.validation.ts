import { z } from 'zod';
/*
  name: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  status: string;
  quantity: number;
  isDeleted: boolean;

*/
export const ProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    description: z.string({ required_error: 'Product description is required' }),
    category: z.string({ required_error: 'Product category is required' }),
    images: z.array(z.string()).optional(), 
    price: z
      .number({ required_error: 'Product price is required' })
      .nonnegative(),
    status: z.string({ required_error: 'Product status is required' }),
    quantity: z.number({ required_error: 'Product quantity is required' }).nonnegative(),
  }),
});

export const ProductUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    price: z.number().nonnegative().optional(),
    status: z.string().optional(),
    quentity: z.string().optional(),
  }),
});
