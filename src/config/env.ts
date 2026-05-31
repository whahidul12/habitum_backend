import { z } from "zod";

export const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(8000),

  MONGODB_URI: z
    .string()
    .url()
    .startsWith("mongodb+srv://", { message: "Must be a valid MongoDB Atlas SRV URI" }),

  JWT_SECRET: z
    .string()
    .min(32, { message: "JWT Secret must be at least 32 characters long for security" }),

  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, {
    message: "Must be a valid timeframe string (e.g., 30d, 1h)",
  }),

  GEMINI_API_KEY: z
    .string()
    .startsWith("AIzaSy", { message: "Invalid Gemini API key format" })
    .length(39, { message: "Gemini API keys are exactly 39 characters long" }),

  GEMINI_MODEL: z.enum([
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ]),

  CLIENT_URL: z.url().transform((url) => url.replace(/\/$/, "")),
});

export const validateEnv = () => {
  const { success, data, error } = envSchema.safeParse(process.env);

  if (!success) {
    console.error("❌ Invalid environment variables:", error.format());
    process.exit(1);
  }

  return data;
};

export type EnvConfig = z.infer<typeof envSchema>;
