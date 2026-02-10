import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[0-9]{7,15}$/.test(val),
      "Please enter a valid phone number",
    ),
  address: z
    .string()
    .max(200, "Address must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  vegetarianMeals: z.boolean().optional(),
  windowSeat: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
