import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as AuthService from "./auth.service.js";
import { ApiError } from "@/utils/ApiError.js";

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  },
);

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  },
);

export const me: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    res.status(200).json({
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        morningMotivation: req.user.morningMotivation,
      },
    });
  },
);

export const updateProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AuthService.updateProfile(
      req.user!._id.toString(),
      req.body,
    );
    res.status(200).json(user);
  },
);
