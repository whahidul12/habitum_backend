import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError.js";

export const validateSuggestHabits = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { goals, productiveTime, struggles } = req.body;
  if (goals && typeof goals !== "string")
    throw ApiError.badRequest("goals must be a string");
  if (productiveTime && typeof productiveTime !== "string")
    throw ApiError.badRequest("productiveTime must be a string");
  if (struggles && typeof struggles !== "string")
    throw ApiError.badRequest("struggles must be a string");
  next();
};

export const validateRecoveryPlan = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { habitId } = req.body;
  if (!habitId || typeof habitId !== "string") {
    throw ApiError.badRequest("habitId is a required string parameter");
  }
  next();
};

export const validateChatAnalysis = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    throw ApiError.badRequest("question is required and must be a string");
  }
  next();
};
