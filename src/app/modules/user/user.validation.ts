import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

export const userCreateValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.CUSTOMER),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
  }),
});

// Address Schema
const addressSchema = z.object({
  phone: z
    .string()
    .regex(/^01[3-9][0-9]{8}$/, 'Invalid Bangladeshi phone number'),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

// Final User Validation Schema
export const userUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long')
      .max(15, 'Phone number must be at most 15 characters long')
      .optional(),
    avatar: z.string().url('Avatar must be a valid URL').optional(),
    addresses: z.array(addressSchema).optional(),
  }),
});

export const userUpdateRoleOrStatusValidationSchema = z.object({
  body: z.object({
    role: z.nativeEnum(USER_ROLE).optional(),
    status: z.nativeEnum(USER_STATUS).optional(),
  }),
});

export const userChangePasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    oldPassword: z
      .string()
      .min(4, 'Old password must be at least 4 characters long'),
    newPassword: z
      .string()
      .min(4, 'New password must be at least 4 characters long'),
  }),
});

export const contactValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'নাম অবশ্যই দিতে হবে।',
    }).min(1, 'নাম খালি রাখা যাবে না।'),

    email: z.string({
      required_error: 'ইমেইল দিতে হবে।',
    }).email('বৈধ ইমেইল দিন।'),

    message: z.string({
      required_error: 'বার্তা লিখতে হবে।',
    }).min(5, 'বার্তা কমপক্ষে ৫ অক্ষরের হতে হবে।'),
  }),
});
