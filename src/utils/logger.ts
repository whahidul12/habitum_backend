import winston from "winston";
import { env } from "../config/env.js";

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

// ── Dev format: readable, colorized, single line ──────────────
const devFormat = combine(
  errors({ stack: true }),
  colorize({ all: true }),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const extras = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
    const trace = stack ? `\n${stack}` : "";
    return `${timestamp} [${level}] ${message}${extras}${trace}`;
  }),
);

// ── Prod format: structured JSON for log aggregators ──────────
const prodFormat = combine(errors({ stack: true }), timestamp(), json());

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "debug",
  format: env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});
