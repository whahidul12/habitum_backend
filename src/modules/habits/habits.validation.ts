import { z } from "zod";

export const getHabitsQuerySchema = z.object({
  includeArchived: z.enum(["true", "false"]).optional(),
});

export const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required").trim(),
  description: z.string().trim().optional(),
  category: z
    .enum([
      "Health",
      "Fitness",
      "Learning",
      "Mindfulness",
      "Productivity",
      "Social",
      "Finance",
      "Creative",
      "Other",
    ])
    .optional(),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).trim().optional(),
  description: z.string().trim().optional(),
  category: z
    .enum([
      "Health",
      "Fitness",
      "Learning",
      "Mindfulness",
      "Productivity",
      "Social",
      "Finance",
      "Creative",
      "Other",
    ])
    .optional(),
  frequency: z.enum(["daily", "weekly"]).optional(),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export const reorderHabitsSchema = z.object({
  order: z.array(z.string().min(1)).min(1, "Order array cannot be empty"),
});

export const habitIdSchema = z.object({
  id: z.string().min(1, "Habit ID is required"),
});
