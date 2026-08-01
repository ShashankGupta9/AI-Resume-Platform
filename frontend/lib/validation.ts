import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, { message: 'Full Name must be at least 3 characters' }),
    company_name: z
      .string()
      .min(1, { message: 'Company Name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid work email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(PASSWORD_REGEX, {
        message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),
    confirm_password: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
