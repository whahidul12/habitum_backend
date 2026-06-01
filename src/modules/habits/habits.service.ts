import { ApiError } from "../../utils/ApiError.js";
import type {
  CreateHabitDto,
  UpdateHabitDto,
  ReorderHabitsDto,
  GetHabitsQueryDto,
} from "./habits.types.js";
import Habit from "@/models/habit/Habit.model.js";
import HabitLog from "@/models/habitLog/HabitLog.model.js";

export const getHabits = async (userId: string, query: GetHabitsQueryDto) => {
  const filter: Record<string, unknown> = { userId };
  if (query.includeArchived !== "true") filter.isArchived = false;

  const habits = await Habit.find(filter).sort({ order: 1, createdAt: 1 });
  return habits;
};

export const createHabit = async (userId: string, data: CreateHabitDto) => {
  const count = await Habit.countDocuments({ userId });

  const habit = await Habit.create({
    userId,
    ...data,
    order: count,
  });

  return habit;
};

export const updateHabit = async (
  habitId: string,
  userId: string,
  data: UpdateHabitDto,
) => {
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  Object.assign(habit, data);
  await habit.save();
  return habit;
};

export const deleteHabit = async (habitId: string, userId: string) => {
  const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  await HabitLog.deleteMany({ habitId: habit._id, userId });
};

export const archiveHabit = async (habitId: string, userId: string) => {
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  habit.isArchived = !habit.isArchived;
  await habit.save();
  return habit;
};

export const reorderHabits = async (userId: string, data: ReorderHabitsDto) => {
  await Promise.all(
    data.order.map((id, idx) =>
      Habit.updateOne({ _id: id, userId }, { $set: { order: idx } }),
    ),
  );
};
