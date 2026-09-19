import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getCurrentUser,
  getDashboard,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

router.get(
  "/dashboard",
  authMiddleware,
  getDashboard
);

export default router;