import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError.js";

export const validateMarkComplete = (req: Request, res: Response, next: NextFunction) => {
  const { habitId } = req.body;
  if (!habitId || typeof habitId !== "string") {
    throw ApiError.badRequest("habitId is required and must be a string");
  }
  next();
};

export const validateGetRange = (req: Request, res: Response, next: NextFunction) => {
  const { start, end } = req.query;
  if (!start || !end || typeof start !== "string" || typeof end !== "string") {
    throw ApiError.badRequest(
      "Both 'start' and 'end' query parameters are required strings",
    );
  }
  next();
};
