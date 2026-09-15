import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route.",
    user: req.user,
  });
});

export default router;