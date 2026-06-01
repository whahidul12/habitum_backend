import { ApiError } from "../../utils/ApiError.js";
import Habit from "@/models/habit/Habit.model.js";
import HabitLog from "@/models/habitLog/HabitLog.model.js";
import { calcStreak, lastNDays, todayKey, last90Days } from "../../utils/dateHelper.js";
import type {
  MarkCompleteDto,
  UnmarkCompleteDto,
  GetRangeQueryDto,
} from "./habitLog.types.js";

export const markComplete = async (userId: string, data: MarkCompleteDto) => {
  const completedDate = data.date || todayKey();

  const habit = await Habit.findOne({ _id: data.habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  const log = await HabitLog.findOneAndUpdate(
    { userId, habitId: data.habitId, completedDate },
    { $setOnInsert: { userId, habitId: data.habitId, completedDate } },
    { upsert: true, new: true },
  );

  return log;
};

export const unmarkComplete = async (userId: string, data: UnmarkCompleteDto) => {
  const completedDate = data.date || todayKey();
  await HabitLog.findOneAndDelete({ userId, habitId: data.habitId, completedDate });
};

export const getTodayLogs = async (userId: string) => {
  return await HabitLog.find({ userId, completedDate: todayKey() });
};

export const getRangeLogs = async (userId: string, query: GetRangeQueryDto) => {
  return await HabitLog.find({
    userId,
    completedDate: { $gte: query.start, $lte: query.end },
  });
};

export const getHeatMapData = async (userId: string) => {
  const days = last90Days();
  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const counts: Record<string, number> = {};
  for (const d of days) counts[d] = 0;
  for (const l of logs) {
    counts[l.completedDate] = (counts[l.completedDate] || 0) + 1;
  }

  return days.map((d) => ({ date: d, count: counts[d] || 0 }));
};

export const getHabitStats = async (userId: string, habitId: string) => {
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  const logs = await HabitLog.find({ userId, habitId }).sort({ completedDate: -1 });

  const dateKeys = logs.map((l) => l.completedDate);
  const { current, longest } = calcStreak(dateKeys);

  // Completion rate since habit creation
  const createKeys = habit.createdAt.toISOString().slice(0, 10);
  const today = todayKey();
  const start = new Date(createKeys);
  const end = new Date(today);

  const totalDays =
    Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) +
    1;
  const completionRate = Math.round((logs.length / totalDays) * 100);

  // Monthly breakdown (last 6 months)
  const monthly: Record<string, number> = {};
  for (const l of logs) {
    const m = l.completedDate.slice(0, 7);
    monthly[m] = (monthly[m] || 0) + 1;
  }

  return {
    habit,
    totalCompletions: logs.length,
    currentStreak: current,
    longestStreak: longest,
    completionRate,
    monthly,
  };
};

export const getAllStats = async (userId: string) => {
  const habits = await Habit.find({ userId, isArchived: false });
  const days = lastNDays(30);

  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const perHabit = habits.map((h) => {
    const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
    const keys = hLogs
      .map((l) => l.completedDate)
      .sort()
      .reverse();
    const { current, longest } = calcStreak(keys);

    return {
      habitId: h._id,
      name: h.name,
      icon: h.icon,
      color: h.color,
      category: h.category,
      completions30d: hLogs.length,
      currentStreak: current,
      longestStreak: longest,
    };
  });

  return { perHabit, days };
};
