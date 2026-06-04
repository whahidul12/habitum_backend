import { z } from "zod";

// Zod schema for marking a habit as complete
export const markCompleteSchema = z.object({
  habitId: z.string().min(1, "habitId is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
});

// Zod schema for unmarking (deleting) a habit completion
export const unmarkCompleteSchema = z.object({
  habitId: z.string().min(1, "habitId is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
});

// Zod schema for getting logs in a date range
export const getRangeQuerySchema = z.object({
  start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
});
