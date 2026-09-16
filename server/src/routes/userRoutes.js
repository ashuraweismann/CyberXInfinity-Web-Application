import express from "express";

import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select(
        "_id name username email points completedLabs completedLabIds"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user.",
      });
    }
  }
);

export default router;