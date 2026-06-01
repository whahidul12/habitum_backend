import Habit from "@/models/habit/Habit.model.js";
import HabitLog from "@/models/habitLog/HabitLog.model.js";
// import AIInsight from "@/models/aiInsight/AiInsight.model.js";
import { chatCompletion, SYSTEM_PROMPTS } from "../../utils/ai/ai.utils.js";
import { calcStreak, lastNDays, todayKey } from "../../utils/dateHelper.js";
import { ApiError } from "../../utils/ApiError.js";
import type {
  SuggestHabitsDto,
  RecoveryPlanDto,
  ChatAnalysisDto,
  HabitSuggestion,
  BuildWeeklyContextResult,
} from "./aiInsight.types.js";
import AIInsight from "@/models/aiInsight/AiInsight.model.js";
import { EInsightType } from "@/models/aiInsight/aiInsight.types.js";

const buildWeeklyContext = async (userId: string): Promise<BuildWeeklyContextResult> => {
  const habits = await Habit.find({ userId, isArchived: false });
  const days = lastNDays(7);
  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const preHabit = habits.map((h) => {
    const completed = logs.filter((l) => String(l.habitId) === String(h._id)).length;
    return {
      name: h.name,
      category: h.category,
      frequency: h.frequency,
      completedDays: completed,
      targetDays: h.targetDays || [],
    };
  });

  return { days, preHabit };
};

export const getWeeklyReport = async (userId: string) => {
  const ctx = await buildWeeklyContext(userId);
  if (!ctx.preHabit.length) {
    return {
      content:
        "You don't have any active habits yet. Create your first habit to start tracking - I'll generate a weekly report once you have some data.",
    };
  }

  const userMsg = `Here is the user's habit data for the past 7 days (${ctx.days[0]} to ${ctx.days[6]}): \n\n${ctx.preHabit
    .map(
      (h) =>
        `- ${h.name} (${h.category}, ${h.frequency}): completed ${h.completedDays} of the past 7 days, target ${h.targetDays.length}/week`,
    )
    .join("\n")}\n\nPlease write the personalised weekly report now.`;

  const { content } = await chatCompletion({
    system: SYSTEM_PROMPTS.weekly,
    user: userMsg,
  });

  await AIInsight.create({ userId, type: EInsightType.WEEKLY, content });
  return { content };
};

export const getSuggestedHabits = async (userId: string, data: SuggestHabitsDto) => {
  const { goals, productiveTime, struggles } = data;
  const userMsg = `User goals: ${goals || "not provided"} \nMost productive time: ${productiveTime || "not provided"} \nPast struggles: ${struggles || "not provided"}\n\nSuggest 3 personalised habits now. Return JSON only.`;

  const { content } = await chatCompletion({
    system: SYSTEM_PROMPTS.suggestion,
    user: userMsg,
  });

  let suggestions: HabitSuggestion[] = [];
  try {
    const cleanJson = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    suggestions = parsed.suggestions || [];
  } catch (err) {
    suggestions = [];
  }

  if (!suggestions.length) {
    suggestions = [
      {
        name: "10-minute morning walk",
        description: "Start the day with light movement and fresh air",
        frequency: "daily",
        category: "Fitness",
        icon: "🏃‍♂️",
        reason: "Low-friction way to build consistency early in the day",
      },
      {
        name: "Read 5 pages",
        description: "Short daily reading to build a learning routine",
        frequency: "daily",
        category: "Learning",
        icon: "📚",
        reason: "Compound into significant knowledge over weeks.",
      },
      {
        name: "2 minutes of mindful breathing",
        description: "Pause and breathe to reset focus and reduce stress.",
        frequency: "daily",
        category: "Mindfulness",
        icon: "🍀",
        reason: "Tiny anchor habit that fits any schedule.",
      },
    ];
  }

  await AIInsight.create({
    userId,
    type: EInsightType.SUGGESTION,
    content: JSON.stringify(suggestions),
    meta: { goals, productiveTime, struggles },
  });

  return { suggestions };
};

export const getRecoveryPlan = async (userId: string, data: RecoveryPlanDto) => {
  const habit = await Habit.findOne({ _id: data.habitId, userId });
  if (!habit) throw ApiError.notFound("Habit not found");

  const logs = await HabitLog.find({ userId, habitId: data.habitId }).sort({
    completedDate: -1,
  });
  const keys = logs.map((l) => l.completedDate);
  const { current, longest } = calcStreak(keys);

  const userMsg = `Habit: ${habit.name} (${habit.category}).\nDescription: ${habit.description || "none"}\nCurrent Streak: ${current} days. Longest ever: ${longest} days. The user just broke a streak. Write a warm, actionable 3-days recovery plan.`;

  const { content } = await chatCompletion({
    system: SYSTEM_PROMPTS.recovery,
    user: userMsg,
  });

  await AIInsight.create({
    userId,
    type: EInsightType.RECOVERY,
    content,
    meta: { habitId: data.habitId },
  });
  return { content };
};

export const analyzeChatData = async (userId: string, data: ChatAnalysisDto) => {
  const habits = await Habit.find({ userId, isArchived: false });
  const days = lastNDays(30);
  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const context = habits
    .map((h) => {
      const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
      const byDayOfWeek = [0, 0, 0, 0, 0, 0, 0];
      for (const l of hLogs) {
        const dayOfWeek = new Date(l.completedDate).getDay();
        byDayOfWeek[dayOfWeek] += 1;
      }
      return `${h.name} (${h.category}): ${hLogs.length}/30 in last 30 days, by weekday [sun,Mon,Tue,Wed,Thu,Fri, Sat] ${byDayOfWeek}`;
    })
    .join("\n");

  const userMsg = `User question: "${data.question}"\n\nUser data (last 30 days):\n${context}\n\nAnswer now.`;
  const { content } = await chatCompletion({
    system: SYSTEM_PROMPTS.chat,
    user: userMsg,
  });

  await AIInsight.create({
    userId,
    type: EInsightType.CHAT,
    content,
    meta: { question: data.question },
  });
  return { content };
};

export const getMorningMotivation = async (userId: string) => {
  const habits = await Habit.find({ userId, isArchived: false });
  if (!habits.length) {
    return {
      content:
        "Good morning! Add your first habit today and let's get the momentum started.",
    };
  }

  const days = lastNDays(30);
  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const ctx = habits
    .map((h) => {
      const hLogs = logs
        .filter((l) => String(l.habitId) === String(h._id))
        .map((l) => l.completedDate)
        .sort()
        .reverse();

      const { current } = calcStreak(hLogs);
      return `${h.name}: current streak ${current}`;
    })
    .join("\n");

  const today = todayKey();
  const todayLogs = logs.filter((l) => l.completedDate === today);
  const done = todayLogs.length;
  const total = habits.length;

  const userMsg = `Today's habits and streaks:\n${ctx}\n\nDone today: ${done}/${total}. Write the morning motivation.`;

  const { content } = await chatCompletion({
    system: SYSTEM_PROMPTS.morning,
    user: userMsg,
    temperature: 0.8,
  });

  await AIInsight.create({ userId, type: EInsightType.MORNING, content });
  return { content };
};
