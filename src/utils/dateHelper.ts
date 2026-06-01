import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

/**
 * Converts a Date object into a string key format (YYYY-MM-DD)
 */
export const toDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

/**
 * Returns today's date formatted as a string key (YYYY-MM-DD)
 */
export const todayKey = (): string => toDateKey(new Date());

/**
 * Returns an array of the last 90 days as YYYY-MM-DD keys
 */
export const last90Days = (): string[] => {
  const end = new Date();
  const start = subDays(end, 89);
  return eachDayOfInterval({ start, end }).map(toDateKey);
};

/**
 * Returns an array of date keys for the current week (Monday to Sunday)
 */
export const currentWeekKeys = (): string[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(toDateKey);
};

/**
 * Returns an array of date keys for the last N days
 */
export const lastNDays = (n: number): string[] => {
  const end = new Date();
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map(toDateKey);
};

/**
 * Represents the streak calculation results
 */
export interface IStreakResult {
  current: number;
  longest: number;
}

/**
 * Calculates the current and longest habit streaks based on historical completion keys.
 * Expects date keys in YYYY-MM-DD format.
 */
export const calcStreak = (sortedDateKeys: string[]): IStreakResult => {
  if (!sortedDateKeys.length) return { current: 0, longest: 0 };

  const set = new Set<string>(sortedDateKeys);
  const today = todayKey();
  const yesterday = toDateKey(subDays(new Date(), 1));

  let current = 0;
  let cursor = new Date();

  // 1. Calculate Current Streak
  if (!set.has(today) && !set.has(yesterday)) {
    current = 0;
  } else {
    if (!set.has(today)) {
      cursor = subDays(cursor, 1);
    }
    while (set.has(toDateKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }

  // 2. Calculate Longest Streak
  // Best Practice: Ensure true alphanumeric chronological sorting
  const sortedAsc = [...sortedDateKeys].sort((a, b) => a.localeCompare(b));

  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const k of sortedAsc) {
    if (prev) {
      const d = new Date(k).getTime();
      const p = new Date(prev).getTime();

      // Explicitly type-casting the difference calculation
      const diff = Math.round((d - p) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        run += 1;
      } else if (diff > 1) {
        // Only reset run if it's a break in days, ignore duplicates
        run = 1;
      }
    } else {
      run = 1;
    }

    if (run > longest) longest = run;
    prev = k;
  }

  return { current, longest };
};
