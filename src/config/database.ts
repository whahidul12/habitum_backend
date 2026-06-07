import mongoose from "mongoose";
import { env } from "./env.js";
import dns from "node:dns";
import { logger } from "@/utils/logger.js";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google's DNS servers
}

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connecting, wait for the connection
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
    });
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    isConnected = true;
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed", { error });
    isConnected = false;
    throw error; // Re-throw to handle in caller
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
  isConnected = false;
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
  isConnected = true;
});

// Only set up SIGINT handler in non-serverless environments
if (process.env.VERCEL !== "1") {
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed (app shutdown)");
    process.exit(0);
  });
}
