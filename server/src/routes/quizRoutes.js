import express from "express";

import {
  getQuizByLab,
  submitQuiz,
} from "../controllers/quizController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/lab/:labId",
  authMiddleware,
  getQuizByLab
);

router.post(
  "/:labId/submit",
  authMiddleware,
  submitQuiz
);

export default router;