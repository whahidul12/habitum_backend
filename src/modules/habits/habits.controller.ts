import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as HabitsService from "./habits.service.js";

export const getHabits: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const habits = await HabitsService.getHabits(
      req.user!._id.toString(),
      req.query as Record<string, string>,
    );
    res.status(200).json(habits);
  },
);

export const createHabit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const habit = await HabitsService.createHabit(
      req.user!._id.toString(),
      req.body,
    );
    res.status(201).json(habit);
  },
);

export const updateHabit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const habit = await HabitsService.updateHabit(
      req.params.id as string,
      req.user!._id.toString(),
      req.body,
    );
    res.status(200).json(habit);
  },
);

export const deleteHabit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await HabitsService.deleteHabit(
      req.params.id as string,
      req.user!._id.toString(),
    );
    res.status(200).json({ success: true, message: "Habit deleted" });
  },
);

export const archiveHabit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const habit = await HabitsService.archiveHabit(
      req.params.id as string,
      req.user!._id.toString(),
    );
    res.status(200).json(habit);
  },
);

export const reorderHabits: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await HabitsService.reorderHabits(req.user!._id.toString(), req.body);
    res.status(200).json({ success: true, message: "Reordered" });
  },
);
