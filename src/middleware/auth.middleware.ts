import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { ApiError } from "@/utils/ApiError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import User from "@/models/user/User.model.js";

interface JwtPayload {
  id: string;
}

export const protect: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw ApiError.unauthorized("User no longer exists");

    req.user = user;
    next();
  },
);
