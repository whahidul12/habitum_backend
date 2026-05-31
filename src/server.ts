import app from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import dns from "node:dns";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

start();
