import mongoose, { Types } from "mongoose";
import { format, subDays } from "date-fns";
import { connectDB } from "../config/database.js";
import Users from "../models/user/User.model.js";
import HabitsLog from "../models/habitLog/HabitLog.model.js";
import Habits from "../models/habit/Habit.model.js";
import AIinsight from "../models/aiInsight/AiInsight.model.js";
import { HabitCategory } from "@/types/habit.types.js";

const EMAIL = "whahid@gmail.com";
const PASSWORD = "whahid123";
const NAME = "Whahidul Islam";

interface SeedHabitConfig {
  name: string;
  description: string;
  category: HabitCategory; // Use strict literal union matching the model error
  frequency: "daily" | "weekly";
  targetDays: number[]; // Fixed: Must be an array of numbers per your schema rules
  color: string;
  icon: string;
  _streakProb: number;
  _pattern?: "weekdays" | "dropOff";
  _brokeAt?: number;
}

const HABITS: SeedHabitConfig[] = [
  {
    name: "Drink 2L of water",
    description: "Stay hydrated throughout the day",
    category: "Health",
    frequency: "daily",
    targetDays: [0, 1, 2, 3, 4, 5, 6], // Representing all 7 days safely
    color: "#0ea5e9",
    icon: "💧",
    _streakProb: 0.95,
  },
  {
    name: "Morning run",
    description: "Stay hydrated throughout the day",
    category: "Fitness",
    frequency: "daily",
    targetDays: [1, 2, 3, 4, 5], // Representing 5 days
    color: "#ef4444",
    icon: "🏃‍♂️",
    _streakProb: 0.7,
    _pattern: "weekdays",
    _brokeAt: 20,
  },
  {
    name: "Read 20 minutes",
    description: "Fiction or non-fiction, no phone.",
    category: "Learning",
    frequency: "daily",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#6366f1",
    icon: "📚",
    _streakProb: 0.82,
  },
  {
    name: "Meditate",
    description: "10 minutes of breath-focused meditation.",
    category: "Mindfulness",
    frequency: "daily",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#8b5cf6",
    icon: "🌱",
    _streakProb: 0.6,
  },
  {
    name: "Journal",
    description: "Write 3 things I'm grateful for.",
    category: "Mindfulness",
    frequency: "daily",
    targetDays: [1, 2, 3, 4, 5],
    color: "#ec4899",
    icon: "✍",
    _streakProb: 0.75,
    _pattern: "dropOff",
  },
  {
    name: "Calisthenics",
    description:
      "Strength training for build muscle, endurance, and flexibility.",
    category: "Fitness",
    frequency: "weekly",
    targetDays: [1, 3, 5], // 3 specific target days
    color: "#f59e0b",
    icon: "💪",
    _streakProb: 0.82,
    _pattern: "weekdays",
  },
  {
    name: "Stay away from LOVE",
    description: "If she dosen't want them stay out of her way.",
    category: "Learning",
    frequency: "daily",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#eb1e95",
    icon: "💔",
    _streakProb: 0.63,
    _pattern: "dropOff",
  },
  {
    name: "No phone after 10pm",
    description: "Leave your phone outside of bedroom.",
    category: "Health",
    frequency: "daily",
    targetDays: [1, 2, 3, 4, 5, 6],
    color: "#10b981",
    icon: "📴",
    _streakProb: 0.65,
  },
  {
    name: "Side project - 1hr",
    description: "Ship something small every day.",
    category: "Productivity",
    frequency: "daily",
    targetDays: [1, 2, 3, 4, 5, 6],
    color: "#14b8a6",
    icon: "🎯",
    _streakProb: 0.82,
  },
];

const todayKey = (): string => format(new Date(), "yyyy-MM-dd");

interface LogEntry {
  completedDate: string;
}

const buildLogs = (habit: SeedHabitConfig, totalDays = 90): LogEntry[] => {
  const logs: LogEntry[] = [];
  const today = new Date();

  for (let i = 0; i < totalDays; i++) {
    const day = subDays(today, i);
    const dayOfWeek = day.getDay();
    const key = format(day, "yyyy-MM-dd");
    let p = habit._streakProb;

    if (habit._pattern === "weekdays") {
      if (dayOfWeek === 0 || dayOfWeek === 6) p *= 0.35;
    }
    if (habit._pattern === "dropOff") {
      if (i < 14) p *= 0.25;
    }
    if (habit._brokeAt && i >= habit._brokeAt - 2 && i <= habit._brokeAt + 2) {
      continue;
    }

    const seed = Math.sin(i * 9301 + habit.name.length * 49297) * 233280;
    const rnd = seed - Math.floor(seed);
    if (rnd < p) logs.push({ completedDate: key });
  }
  return logs;
};

const run = async (): Promise<void> => {
  await connectDB();

  // 2. Explicitly type user variable instance to allow updates cleanly
  let user: any = await Users.findOne({ email: EMAIL });

  if (user) {
    console.log(`Found existing user ${EMAIL} - clearing their data...`);
    await Habits.deleteMany({ userId: user._id });
    await HabitsLog.deleteMany({ userId: user._id });
    await AIinsight.deleteMany({ userId: user._id });

    user.name = NAME;
    user.avatar = NAME.charAt(0).toUpperCase();
    user.morningMotivation = true;
    user.password = PASSWORD;
    await user.save();
  } else {
    user = await Users.create({
      name: NAME,
      email: EMAIL,
      password: PASSWORD,
      avatar: NAME.charAt(0).toUpperCase(),
      morningMotivation: true,
    });
    console.log(`Created User: ${NAME} => (email:${EMAIL})`);
  }

  const userIdString = (user._id as Types.ObjectId).toString();
  const createHabit: Array<{ habit: any; config: SeedHabitConfig }> = [];

  // Generate historical habits setup backdated to 89 days ago
  for (let i = 0; i < HABITS.length; i++) {
    const h = HABITS[i];
    const habit = await Habits.create({
      userId: userIdString,
      name: h.name,
      description: h.description,
      category: h.category,
      frequency: h.frequency,
      targetDays: h.targetDays.length, // Now cleanly accepts array payload parameters safely
      color: h.color,
      icon: h.icon,
      order: i,
      createdAt: subDays(new Date(), 89),
      updatedAt: subDays(new Date(), 89),
    });

    // Enforce backdated createdAt field securely bypassing basic hook modifications
    (habit as any).createdAt = subDays(new Date(), 89);
    await habit.save({ timestamps: false });
    createHabit.push({ habit, config: h });
  }

  let totalLogs = 0;

  // Mass compile dynamic tracking history logs
  for (const { habit, config } of createHabit) {
    const logs = buildLogs(config);
    if (!logs.length) continue;

    const docs = logs.map((l) => ({
      userId: userIdString,
      habitId: (habit._id as Types.ObjectId).toString(),
      completedDate: l.completedDate,
    }));

    try {
      // Use ordered: false to skip duplicates rather than completely erroring out
      await HabitsLog.insertMany(docs, { ordered: false });
    } catch (catchError) {
      // Catch bulk insertion errors gracefully
    }
    totalLogs += docs.length;
  }

  // Always mark the first 4 habits as completed for today
  const today = todayKey();
  const todayDoneHabits = createHabit.slice(0, 4).map((c) => c.habit);

  for (const h of todayDoneHabits) {
    await HabitsLog.updateOne(
      {
        userId: userIdString,
        habitId: (h._id as Types.ObjectId).toString(),
        completedDate: today,
      },
      {
        $setOnInsert: {
          userId: userIdString,
          habitId: (h._id as Types.ObjectId).toString(),
          completedDate: today,
        },
      },
      { upsert: true },
    );
  }

  console.log(`\n✅ Seed Complete`);
  console.log(`✅ User: ${NAME}`);
  console.log(`✅ Email: ${EMAIL}`);
  console.log(`✅ Password: ${PASSWORD}`);
  console.log(`✅ Habits: ${createHabit.length}`);
  console.log(`✅ Logs: ${totalLogs}`);

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
