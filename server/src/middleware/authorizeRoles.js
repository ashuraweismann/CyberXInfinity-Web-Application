import User from "../models/User.js";

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // authMiddleware must run first and set req.user.
      const user = await User.findById(
        req.user.userId
      ).select("role");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found.",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
      }

      req.authenticatedUserRole = user.role;

      next();
    } catch (error) {
      console.error("Role authorization error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to verify user permissions.",
      });
    }
  };
};

export default authorizeRoles;