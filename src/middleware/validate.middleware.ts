import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

// 1. Define a literal type for the allowed request segments
type RequestSource = "body" | "query" | "params";

export const validate =
  (
    schema: ZodType,
    source: RequestSource = "body", // 2. Default to "body" if not passed
  ) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    // 3. Dynamically parse the target data location
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw ApiError.badRequest(message);
    }

    // 4. Overwrite the parsed and cleaned data back to its source location
    req[source] = result.data;
    next();
  };
