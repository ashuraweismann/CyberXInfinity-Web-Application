import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CyberXInfinity API is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`CyberXInfinity server running on http://localhost:${PORT}`);
});