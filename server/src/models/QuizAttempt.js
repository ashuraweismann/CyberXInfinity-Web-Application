import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
      index: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuizQuestion",
          required: true,
        },

        selectedOption: {
          type: Number,
          required: true,
          min: -1,
          max: 3,
        },

        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    aiSuggestion: {
      summary: {
        type: String,
        default: null,
      },

      strengths: [
        {
          type: String,
        },
      ],

      weakTopics: [
        {
          type: String,
        },
      ],

      recommendations: [
        {
          type: String,
        },
      ],

      nextStep: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({
  user: 1,
  lab: 1,
  createdAt: -1,
});

const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);

export default QuizAttempt;