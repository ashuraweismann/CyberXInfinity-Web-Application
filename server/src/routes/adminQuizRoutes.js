
import express from "express";

import {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} from "../controllers/adminQuizController.js";

const router = express.Router();

router.get("/:labId/questions", getAdminQuestions);

router.post("/:labId/questions", createAdminQuestion);

router.put(
  "/:labId/questions/:questionId",
  updateAdminQuestion
);

router.delete(
  "/:labId/questions/:questionId",
  deleteAdminQuestion
);

export default router;
