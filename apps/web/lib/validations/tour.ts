import { z } from "zod";

export const scheduleSchema = z.object({
  startDate: z.string().min(1, "Start date is required").refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: "Start date must be today or later" },
  ),
  maxCapacity: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Max capacity must be at least 1"),
});

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
  schedules: z.array(scheduleSchema).optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type TourFormData = z.infer<typeof tourSchema>;
