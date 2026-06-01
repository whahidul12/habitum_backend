import { z } from "zod";
import {
  createHabitSchema,
  updateHabitSchema,
  reorderHabitsSchema,
  getHabitsQuerySchema,
} from "./habits.validation.js";

export type CreateHabitDto = z.infer<typeof createHabitSchema>;
export type UpdateHabitDto = z.infer<typeof updateHabitSchema>;
export type ReorderHabitsDto = z.infer<typeof reorderHabitsSchema>;
export type GetHabitsQueryDto = z.infer<typeof getHabitsQuerySchema>;
