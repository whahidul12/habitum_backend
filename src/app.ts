import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";

export const app: Express = express();
const clientUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins: string[] = clientUrl
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return cb(null, true);
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

// Explicitly typed Request and Response objects
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

export default app;
