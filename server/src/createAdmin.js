import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME?.trim();
    const username = process.env.ADMIN_USERNAME
      ?.trim()
      .toLowerCase();
    const email = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !username || !email) {
      throw new Error(
        "ADMIN_NAME, ADMIN_USERNAME and ADMIN_EMAIL must be configured."
      );
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      throw new Error(
        "Admin username must be 3–30 characters using letters, numbers or underscores."
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("ADMIN_EMAIL is invalid.");
    }

    await connectDB();

    const existingByEmail = await User.findOne({ email });
    const existingByUsername = await User.findOne({ username });

    if (
      existingByUsername &&
      (!existingByEmail ||
        existingByUsername._id.toString() !==
        existingByEmail._id.toString())
    ) {
      throw new Error(
        "That username belongs to a different account. Choose another ADMIN_USERNAME."
      );
    }

    if (existingByEmail) {
      // Promote this existing account without changing its password.
      existingByEmail.name = name;
      existingByEmail.username = username;
      existingByEmail.role = "admin";

      await existingByEmail.save();

      console.log(
        `Existing account ${email} was promoted to admin. Its password was not changed.`
      );
    } else {
      if (!password || password.length < 12) {
        throw new Error(
          "For a new admin account, set ADMIN_PASSWORD to at least 12 characters."
        );
      }

      const hashedPassword = await bcrypt.hash(
        password,
        12
      );

      await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log(`Admin account created for ${email}.`);
    }
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();