import express, { IRouter } from "express";
import * as LogController from "./habitLog.controller.js";
import {
  markCompleteSchema,
  unmarkCompleteSchema,
  getRangeQuerySchema,
} from "./habitLog.validation.js";
import { protect } from "@/middleware/auth.middleware.js";
import { validate } from "@/middleware/validate.middleware.js";

const router: IRouter = express.Router();

router.use(protect);

// Use validate middleware with the Zod schemas
router.post("/", validate(markCompleteSchema), LogController.markComplete);
router.delete(
  "/",
  validate(unmarkCompleteSchema),
  LogController.unmarkComplete,
);

router.get("/today", LogController.getToday);
router.get(
  "/range",
  validate(getRangeQuerySchema, "query"),
  LogController.getRange,
);
router.get("/heatmap", LogController.getHeatMap);
router.get("/stats", LogController.getAllStats);
router.get("/stats/:habitId", LogController.getHabitStats);

export default router;
