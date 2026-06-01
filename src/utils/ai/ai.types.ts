import { HabitCategory } from "@/types/habit.types.js";

export interface IChatCompletionArgs {
  system: string;
  user: string;
  temperature?: number;
}

export interface IAIResponse {
  ok: boolean;
  content: string;
}

export interface ISuggestedHabit {
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  category: HabitCategory;
  icon: string; // Emoji string
  reason: string;
}

export interface ISuggestionJSONResponse {
  suggestions: ISuggestedHabit[];
}
