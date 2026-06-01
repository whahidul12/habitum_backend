import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw ApiError.badRequest(message);
    }

    req.body = result.data;
    next();
  };
