import { HabitCategory } from "@/types/habit.types.js";
import { Document, Types } from "mongoose";

export type HabitFrequency = "daily" | "weekly";

export interface IHabit {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays: number;
  color: string;
  icon: string;
  isArchived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type HabitDocument = IHabit & Document;
