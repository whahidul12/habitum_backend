import { z } from "zod";
import { registerSchema, loginSchema, updateProfileSchema } from "./auth.validation.js";

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    morningMotivation?: boolean;
  };
  token: string;
}
