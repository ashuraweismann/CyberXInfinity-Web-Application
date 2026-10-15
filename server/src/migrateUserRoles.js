import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const migrateUserRoles = async () => {
  try {
    await connectDB();

    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "student" } }
    );

    console.log(
      `User role migration complete. Matched: ${result.matchedCount}, modified: ${result.modifiedCount}`
    );
  } catch (error) {
    console.error("User role migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

migrateUserRoles();