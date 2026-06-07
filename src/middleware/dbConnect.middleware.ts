import { Request, Response, NextFunction } from "express";
import { connectDB } from "@/config/database.js";
import { logger } from "@/utils/logger.js";

/**
 * Middleware to ensure database connection before handling requests
 * Critical for Vercel serverless functions where connection may not persist
 */
export const ensureDbConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error("Database connection failed in middleware", { error });
    res.status(503).json({
      success: false,
      message: "Database connection unavailable. Please try again.",
    });
  }
};
