import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CyberXInfinity API is running 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`CyberXInfinity server running on http://localhost:${PORT}`);
});