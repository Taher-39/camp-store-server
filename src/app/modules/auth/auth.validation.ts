import { z } from 'zod';

export const signinValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
  }),
});

export const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});