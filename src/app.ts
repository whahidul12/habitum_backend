import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import habitRoutes from "./modules/habits/habits.routes.js";
import logsRoutes from "./modules/habitLog/habitLog.routes.js";
import aiRoutes from "./modules/aiInsight/aiInsight.routes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.middleware.js";
import { env } from "./config/env.js";

const app: Application = express();

const clientUrl = env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins: string[] = clientUrl
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(
    origin: string | undefined,
    cb: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return cb(null, true);
    // Automatically allow local preview loops
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("/*any", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Explicitly typed health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Mounted features api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/ai", aiRoutes);

// Fallback error-handling router layers
app.use(notFound);
app.use(errorHandler);

export default app;
