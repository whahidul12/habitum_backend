import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as AuthService from "./auth.service.js";

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: result });
  },
);

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json({ success: true, data: result });
});

export const me: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

export const updateProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AuthService.updateProfile(req.user!._id.toString(), req.body);
    res.status(200).json({ success: true, data: { user } });
  },
);
