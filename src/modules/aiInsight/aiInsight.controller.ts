import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as AiService from "./aiInsight.service.js";
import type {
  SuggestHabitsDto,
  RecoveryPlanDto,
  ChatAnalysisDto,
} from "./aiInsight.types.js";

interface AuthenticatedUser {
  _id: { toString(): string } | string;
}

export const weeklyReport: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const result = await AiService.getWeeklyReport(userId);
    res.status(200).json(result);
  },
);

export const suggestHabits: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const result = await AiService.getSuggestedHabits(
      userId,
      req.body as SuggestHabitsDto,
    );
    res.status(200).json(result);
  },
);

export const recoveryPlan: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const result = await AiService.getRecoveryPlan(userId, req.body as RecoveryPlanDto);
    res.status(200).json(result);
  },
);

export const chatAnalysis: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const result = await AiService.analyzeChatData(userId, req.body as ChatAnalysisDto);
    res.status(200).json(result);
  },
);

export const morningMotivation: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const result = await AiService.getMorningMotivation(userId);
    res.status(200).json(result);
  },
);
