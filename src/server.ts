import app from "./app.js";
import dns from "node:dns";
import { connectDB } from "./config/database.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

if (env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const PORT = env.PORT || 8000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running smoothly on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Critical server bootstrap failure encountered:", error);
    process.exit(1);
  }
};

startServer();
