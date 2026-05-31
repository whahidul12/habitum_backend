import { Schema, model } from "mongoose";
import {
  IHabitLog,
  HabitLogModel,
  IHabitLogMethods,
  HabitLogDocument,
} from "./habitLog.types.js";

const HabitLogSchema = new Schema<IHabitLog, HabitLogModel, IHabitLogMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: [true, "Habit ID is required"],
      index: true,
    },
    completedDate: {
      type: String,
      required: [true, "Completed date is required"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound Unique Index
HabitLogSchema.index({ userId: 1, habitId: 1, completedDate: 1 }, { unique: true });

// add a hook or method later, you can securely use `this: HabitLogDocument` just like your User model!
// HabitLogSchema.pre("save", function (this: HabitLogDocument) { ... });

const HabitLog = model<IHabitLog, HabitLogModel>("HabitLog", HabitLogSchema);
export default HabitLog;
