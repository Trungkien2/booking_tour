import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const socialLoginSchema = z.object({
  idToken: z.string(),
  provider: z.enum(['google', 'apple']),
});

export type SocialLoginData = z.infer<typeof socialLoginSchema>;

/**
 * Validation schema for user registration form.
 * Validates all required and optional fields with appropriate constraints.
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9]{7,15}$/.test(val),
        'Please enter a valid phone number (7-15 digits)'
      ),

    country: z.string().optional(),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    agreeTerms: z
      .boolean()
      .refine((val) => val === true, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
