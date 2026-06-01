import express, { IRouter } from "express"; // Adjust path dynamically if needed
import * as LogController from "./habitLog.controller.js";
import * as LogValidation from "./habitLog.validation.js";
import { protect } from "@/middleware/auth.middleware.js";

const router: IRouter = express.Router();

router.use(protect);

router.post("/", LogValidation.validateMarkComplete, LogController.markComplete);
router.delete("/", LogValidation.validateMarkComplete, LogController.unmarkComplete);

router.get("/today", LogController.getToday);
router.get("/range", LogValidation.validateGetRange, LogController.getRange);
router.get("/heatmap", LogController.getHeatMap);
router.get("/stats", LogController.getAllStats);
router.get("/stats/:habitId", LogController.getHabitStats);

export default router;
