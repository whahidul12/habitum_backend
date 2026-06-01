import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as LogService from "./habitLog.service.js";
import type {
  MarkCompleteDto,
  UnmarkCompleteDto,
  GetRangeQueryDto,
} from "./habitLog.types.js";

// Helper type to deal with the authenticated session user safely
interface AuthenticatedUser {
  _id: { toString(): string } | string;
}

export const markComplete: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const log = await LogService.markComplete(userId, req.body as MarkCompleteDto);
    res.status(201).json(log);
  },
);

export const unmarkComplete: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    await LogService.unmarkComplete(userId, req.body as UnmarkCompleteDto);
    res.status(200).json({ success: true, message: "Unmarked" });
  },
);

export const getToday: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const logs = await LogService.getTodayLogs(userId);
    res.status(200).json(logs);
  },
);

export const getRange: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const logs = await LogService.getRangeLogs(
      userId,
      req.query as unknown as GetRangeQueryDto,
    );
    res.status(200).json(logs);
  },
);

export const getHeatMap: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const data = await LogService.getHeatMapData(userId);
    res.status(200).json(data);
  },
);

export const getHabitStats: RequestHandler<{ habitId: string }> = asyncHandler(
  async (req, res) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const stats = await LogService.getHabitStats(userId, req.params.habitId as string);
    res.status(200).json(stats);
  },
);

export const getAllStats: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as AuthenticatedUser)._id.toString();
    const data = await LogService.getAllStats(userId);
    res.status(200).json(data);
  },
);
