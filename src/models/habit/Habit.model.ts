import { Schema, model } from "mongoose";
import { IHabit, HABIT_CATEGORIES } from "./habit.types.js";

const HabitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: HABIT_CATEGORIES,
        message: "{VALUE} is not a valid habit category",
      },
      default: "Other",
      required: true,
    },
    frequency: {
      type: String,
      enum: {
        values: ["daily", "weekly"],
        message: "Frequency must be either daily or weekly",
      },
      default: "daily",
    },
    targetDays: {
      type: Number,
      default: 7,
      min: [1, "Target days must be at least 1"],
      max: [7, "Target days cannot exceed 7"],
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    icon: {
      type: String,
      default: "🎯",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { __v, ...sanitized } = ret;
        return sanitized;
      },
    },
  },
);

// Export the Habit model
export const Habit = model<IHabit>("Habit", HabitSchema);
export default Habit;
