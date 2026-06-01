import { Types } from "mongoose";

export interface MarkCompleteDto {
  habitId: string;
  date?: string;
}

export interface UnmarkCompleteDto {
  habitId: string;
  date?: string;
}

export interface GetRangeQueryDto {
  start: string;
  end: string;
}

export interface HabitLogResponse {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  habitId: Types.ObjectId | string;
  completedDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}
