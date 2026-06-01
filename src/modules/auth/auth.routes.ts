import { authLimiter } from "@/middleware/rateLimiter.middleware.js";
import { validate } from "@/middleware/validate.middleware.js";
import { Router, type IRouter } from "express";
import { loginSchema, registerSchema, updateProfileSchema } from "./auth.validation.js";
import { login, me, register, updateProfile } from "./auth.controller.js";
import { protect } from "@/middleware/auth.middleware.js";

const router: IRouter = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", protect, me);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

export default router;
