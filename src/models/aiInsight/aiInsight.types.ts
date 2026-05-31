import { Document, Model, Types } from "mongoose";

export enum EInsightType {
  WEEKLY = "weekly",
  SUGGESTION = "suggestion",
  RECOVERY = "recovery",
  CHAT = "chat",
  MORNING = "morning",
}

export interface IAIInsight {
  userId: Types.ObjectId;
  type: EInsightType;
  content: string;
  meta: Record<string, any>; // Stronger type replacing 'any/Mixed' for JSON metadata
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIInsightMethods {}

export type AIInsightDocument = Document & IAIInsight & IAIInsightMethods;

export type AIInsightModel = Model<IAIInsight, {}, IAIInsightMethods>;

export type CreateAIInsightDto = Omit<
  IAIInsight,
  "generatedAt" | "createdAt" | "updatedAt"
> & {
  meta?: Record<string, any>;
  generatedAt?: Date;
};
