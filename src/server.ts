import app from "./app.js";
import dns from "node:dns";
import { connectDB } from "./config/database.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

if (env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const PORT = env.PORT || 8000;

// For Vercel serverless: connection happens per-request via middleware
// For local dev: connect once at startup
if (process.env.VERCEL !== "1") {
  try {
    await connectDB();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Critical database connection failure:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Local server running smoothly on http://localhost:${PORT}`);
  });
}

export default app;
