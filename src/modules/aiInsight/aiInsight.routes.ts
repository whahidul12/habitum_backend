import express, { IRouter } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import * as AiController from "./aiInsight.controller.js";
import * as AiValidation from "./aiInsight.validation.js";

const router: IRouter = express.Router();

router.use(protect);

router.post("/weekly-report", AiController.weeklyReport);
router.post(
  "/suggest-habits",
  AiValidation.validateSuggestHabits,
  AiController.suggestHabits,
);
router.post(
  "/recovery-plan",
  AiValidation.validateRecoveryPlan,
  AiController.recoveryPlan,
); // Fixed 'recovery-plane' typo here
router.post("/chat", AiValidation.validateChatAnalysis, AiController.chatAnalysis);
router.get("/morning", AiController.morningMotivation);

export default router;
