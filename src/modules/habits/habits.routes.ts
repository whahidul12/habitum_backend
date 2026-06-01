import { Router, type IRouter } from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  archiveHabit,
  reorderHabits,
} from "./habits.controller.js";
import {
  createHabitSchema,
  updateHabitSchema,
  reorderHabitsSchema,
  getHabitsQuerySchema,
  habitIdSchema,
} from "./habits.validation.js";
import { protect } from "@/middleware/auth.middleware.js";
import { validate } from "@/middleware/validate.middleware.js";

const router: IRouter = Router();

router.use(protect); // all routes below require auth

router.get("/", validate(getHabitsQuerySchema, "query"), getHabits);
router.post("/", validate(createHabitSchema), createHabit);
router.put("/reorder", validate(reorderHabitsSchema), reorderHabits);
router.put(
  "/:id",
  validate(habitIdSchema, "params"),
  validate(updateHabitSchema),
  updateHabit,
);
router.delete("/:id", validate(habitIdSchema, "params"), deleteHabit);
router.put("/:id/archive", validate(habitIdSchema, "params"), archiveHabit);

export default router;
