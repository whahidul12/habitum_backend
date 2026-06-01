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

// This creates the union type: "Health" | "Fitness" | "Learning" | ...
export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
