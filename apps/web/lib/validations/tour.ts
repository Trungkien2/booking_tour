import { z } from "zod";

export const tourSchema = z.object({
  name: z.string().min(1, "Tour name is required").max(200),
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  images: z.array(z.string().url()).optional(),
  durationDays: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 day"),
  priceAdult: z.coerce.number().min(0, "Price must be non-negative"),
  priceChild: z.coerce.number().min(0, "Price must be non-negative"),
  location: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type TourFormData = z.infer<typeof tourSchema>;
