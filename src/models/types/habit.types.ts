import { Document, Types } from "mongoose";

export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
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
