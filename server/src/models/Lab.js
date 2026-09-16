import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    estimatedTime: {
      type: Number,
      default: 30,
      min: 1,
    },

    order: {
      type: Number,
      required: true,
      unique: true,
    },

    theory: [
      {
        title: {
          type: String,
          required: true,
        },

        content: {
          type: String,
          required: true,
        },
      },
    ],

    keyConcepts: [
      {
        type: String,
        trim: true,
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lab = mongoose.model("Lab", labSchema);

export default Lab;