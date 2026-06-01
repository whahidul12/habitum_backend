export interface SuggestHabitsDto {
  goals?: string;
  productiveTime?: string;
  struggles?: string;
}

export interface RecoveryPlanDto {
  habitId: string;
}

export interface ChatAnalysisDto {
  question: string;
}

export interface HabitSuggestion {
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  category: string;
  icon: string;
  reason: string;
}

export interface BuildWeeklyContextResult {
  days: string[];
  preHabit: Array<{
    name: string;
    category: string;
    frequency: string;
    completedDays: number;
    targetDays: number[];
  }>;
}
