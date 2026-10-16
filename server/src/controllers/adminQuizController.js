
import mongoose from "mongoose";

import Lab from "../models/Lab.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAttempt from "../models/QuizAttempt.js";

const difficulties = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const validateQuestion = (body) => {
  const errors = {};

  const question =
    typeof body.question === "string"
      ? body.question.trim()
      : "";

  const options = Array.isArray(body.options)
    ? body.options.map((option) =>
      typeof option === "string" ? option.trim() : ""
    )
    : [];

  const correctOption =
    body.correctOption === undefined ||
      String(body.correctOption).trim() === ""
      ? NaN
      : Number(body.correctOption);

  const explanation =
    typeof body.explanation === "string"
      ? body.explanation.trim()
      : "";

  const topic =
    typeof body.topic === "string"
      ? body.topic.trim()
      : "";

  const difficulty = body.difficulty;

  const hasOrder =
    body.order !== undefined &&
    body.order !== null &&
    String(body.order).trim() !== "";

  const order = hasOrder ? Number(body.order) : undefined;

  if (question.length < 10 || question.length > 1000) {
    errors.question =
      "Question must contain 10–1000 characters.";
  }

  if (options.length !== 4 || options.some((option) => !option)) {
    errors.options =
      "Provide exactly four non-empty options.";
  } else {
    const normalizedOptions = options.map((option) =>
      option.toLowerCase()
    );

    if (new Set(normalizedOptions).size !== 4) {
      errors.options = "All four options must be different.";
    }

    if (options.some((option) => option.length > 300)) {
      errors.options = "Each option must be at most 300 characters.";
    }
  }

  if (
    !Number.isInteger(correctOption) ||
    correctOption < 0 ||
    correctOption > 3
  ) {
    errors.correctOption =
      "Choose one of the four options as the correct answer.";
  }

  if (
    explanation.length < 10 ||
    explanation.length > 2000
  ) {
    errors.explanation =
      "Explanation must contain 10–2000 characters.";
  }

  if (topic.length < 2 || topic.length > 100) {
    errors.topic = "Topic must contain 2–100 characters.";
  }

  if (!difficulties.includes(difficulty)) {
    errors.difficulty = "Choose a valid difficulty.";
  }

  if (
    hasOrder &&
    (!Number.isInteger(order) || order < 1)
  ) {
    errors.order = "Order must be a positive integer.";
  }

  return {
    errors,
    data: {
      question,
      options,
      correctOption,
      explanation,
      topic,
      difficulty,
      ...(order !== undefined ? { order } : {}),
    },
  };
};

const handleError = (res, error, operation) => {
  console.error(`${operation} failed:`, error.message);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A conflicting record already exists.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Question validation failed.",
      errors: Object.values(error.errors).map(
        (item) => item.message
      ),
    });
  }

  return res.status(500).json({
    success: false,
    message: `${operation} failed.`,
  });
};

// GET questions belonging to one lab.
export const getAdminQuestions = async (req, res) => {
  try {
    const { labId } = req.params;

    if (!mongoose.isValidObjectId(labId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID.",
      });
    }

    const lab = await Lab.findById(labId).select(
      "title slug order"
    );

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    const questions = await QuizQuestion.find({
      lab: labId,
    }).sort({ order: 1, _id: 1 });

    return res.status(200).json({
      success: true,
      lab,
      questions,
      activeQuestionCount: questions.filter(
        (question) => question.isActive !== false
      ).length,
    });
  } catch (error) {
    return handleError(res, error, "Retrieving questions");
  }
};

// POST create a question.
export const createAdminQuestion = async (req, res) => {
  try {
    const { labId } = req.params;

    if (!mongoose.isValidObjectId(labId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID.",
      });
    }

    const lab = await Lab.findById(labId);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    const { errors, data } = validateQuestion(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the question form.",
        errors,
      });
    }

    if (data.order === undefined) {
      const latest = await QuizQuestion.findOne({
        lab: labId,
      })
        .sort({ order: -1 })
        .select("order")
        .lean();

      data.order = latest ? latest.order + 1 : 1;
    }

    const question = await QuizQuestion.create({
      ...data,
      lab: lab._id,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz question created successfully.",
      question,
    });
  } catch (error) {
    return handleError(res, error, "Creating question");
  }
};

// PUT update a question only if it has no historical attempts.
export const updateAdminQuestion = async (req, res) => {
  try {
    const { labId, questionId } = req.params;

    if (
      !mongoose.isValidObjectId(labId) ||
      !mongoose.isValidObjectId(questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab or question ID.",
      });
    }

    const question = await QuizQuestion.findOne({
      _id: questionId,
      lab: labId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found for this lab.",
      });
    }

    const hasAttempts = await QuizAttempt.exists({
      "answers.question": question._id,
    });

    if (hasAttempts) {
      return res.status(409).json({
        success: false,
        message:
          "This question has historical attempts and cannot be edited. Create a replacement question and archive this one instead.",
      });
    }

    const { errors, data } = validateQuestion(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the question form.",
        errors,
      });
    }

    if (data.order === undefined) {
      data.order = question.order;
    }

    question.set(data);
    await question.save();

    return res.status(200).json({
      success: true,
      message: "Quiz question updated successfully.",
      question,
    });
  } catch (error) {
    return handleError(res, error, "Updating question");
  }
};

// DELETE unused questions; archive questions that have attempts.
export const deleteAdminQuestion = async (req, res) => {
  try {
    const { labId, questionId } = req.params;

    if (
      !mongoose.isValidObjectId(labId) ||
      !mongoose.isValidObjectId(questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab or question ID.",
      });
    }

    const question = await QuizQuestion.findOne({
      _id: questionId,
      lab: labId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found for this lab.",
      });
    }

    const hasAttempts = await QuizAttempt.exists({
      "answers.question": question._id,
    });

    if (hasAttempts) {
      question.isActive = false;
      await question.save();

      return res.status(200).json({
        success: true,
        deleted: false,
        archived: true,
        message:
          "This question has student history. It was archived and will no longer appear in new quizzes.",
      });
    }

    await QuizQuestion.deleteOne({
      _id: question._id,
    });

    return res.status(200).json({
      success: true,
      deleted: true,
      archived: false,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Deleting question");
  }
};
