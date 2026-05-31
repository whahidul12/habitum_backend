import { Document, Model, Types } from "mongoose";

export interface IHabitLog {
  userId: Types.ObjectId;
  habitId: Types.ObjectId;
  completedDate: string; // YYYY-MM-DD
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHabitLogMethods {}

export type HabitLogDocument = Document & IHabitLog & IHabitLogMethods;

export type HabitLogModel = Model<IHabitLog, {}, IHabitLogMethods>;

export type CreateHabitLogDto = Omit<IHabitLog, "notes" | "createdAt" | "updatedAt"> & {
  notes?: string;
};
