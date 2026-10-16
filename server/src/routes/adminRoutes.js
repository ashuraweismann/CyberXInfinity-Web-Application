import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import adminLabRoutes from "./adminLabRoutes.js";
import adminQuizRoutes from "./adminQuizRoutes.js";

const router = express.Router();

// Every route registered below this line requires an admin.
router.use(
  authMiddleware,
  authorizeRoles("admin")
);

router.use("/labs", adminLabRoutes);
router.use("/labs", adminQuizRoutes);

// Temporary endpoint used to verify the permission system.
router.get("/check", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Administrator access verified.",
    userId: req.user.userId,
    role: req.authenticatedUserRole,
  });
});

export default router;