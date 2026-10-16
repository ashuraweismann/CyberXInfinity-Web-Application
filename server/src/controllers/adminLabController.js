
import mongoose from "mongoose";

import Lab from "../models/Lab.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

const difficulties = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateLab = (body) => {
  const errors = {};

  const title =
    typeof body.title === "string"
      ? body.title.trim()
      : "";

  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : "";

  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug
      : title
  );

  const difficulty = body.difficulty;
  const estimatedTime = Number(body.estimatedTime);

  let order = null;

  if (
    body.order !== undefined &&
    body.order !== null &&
    String(body.order).trim() !== ""
  ) {
    order = Number(body.order);
  }

  const theory = Array.isArray(body.theory)
    ? body.theory.map((section) => ({
      title:
        typeof section.title === "string"
          ? section.title.trim()
          : "",
      content:
        typeof section.content === "string"
          ? section.content.trim()
          : "",
    }))
    : [];

  const keyConcepts = Array.isArray(body.keyConcepts)
    ? [
      ...new Set(
        body.keyConcepts
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ]
    : [];

  if (title.length < 3 || title.length > 120) {
    errors.title = "Title must contain 3–120 characters.";
  }

  if (description.length < 10 || description.length > 2000) {
    errors.description =
      "Description must contain 10–2000 characters.";
  }

  if (!slug || slug.length > 150) {
    errors.slug = "Provide a valid lab title or slug.";
  }

  if (!difficulties.includes(difficulty)) {
    errors.difficulty = "Select a valid difficulty.";
  }

  if (
    !Number.isInteger(estimatedTime) ||
    estimatedTime < 1 ||
    estimatedTime > 600
  ) {
    errors.estimatedTime =
      "Estimated time must be between 1 and 600 minutes.";
  }

  if (
    order !== null &&
    (!Number.isInteger(order) || order < 1)
  ) {
    errors.order = "Order must be a positive integer.";
  }

  if (!Array.isArray(body.theory) || theory.length === 0) {
    errors.theory = "Add at least one theory section.";
  } else if (
    theory.some(
      (section) =>
        section.title.length < 2 ||
        section.content.length < 10
    )
  ) {
    errors.theory =
      "Every section needs a title and at least 10 characters of content.";
  }

  if (keyConcepts.length === 0) {
    errors.keyConcepts =
      "Add at least one key concept.";
  }

  if (
    body.isPublished !== undefined &&
    typeof body.isPublished !== "boolean"
  ) {
    errors.isPublished =
      "Publication status must be true or false.";
  }

  return {
    errors,
    data: {
      title,
      slug,
      description,
      difficulty,
      estimatedTime,
      ...(order !== null ? { order } : {}),
      theory,
      keyConcepts,
      ...(typeof body.isPublished === "boolean"
        ? { isPublished: body.isPublished }
        : {}),
    },
  };
};

const respondToError = (res, error, operation) => {
  console.error(`${operation} failed:`, error.message);

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];

    return res.status(409).json({
      success: false,
      message:
        field === "order"
          ? "Another lab already uses this display order."
          : "A lab with this slug already exists.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Lab validation failed.",
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

// READ: list labs, including archived labs.
export const getAdminLabs = async (req, res) => {
  try {
    const {
      q = "",
      difficulty = "",
      status = "all",
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const allowedSortFields = [
      "order",
      "title",
      "difficulty",
      "estimatedTime",
      "createdAt",
    ];

    const filter = {};

    if (q.trim()) {
      const search = new RegExp(
        escapeRegex(q.trim()),
        "i"
      );

      filter.$or = [
        { title: search },
        { description: search },
        { slug: search },
        { keyConcepts: search },
      ];
    }

    if (difficulty && difficulties.includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    if (status === "published") {
      filter.isPublished = true;
    } else if (status === "archived") {
      filter.isPublished = false;
    } else if (status !== "all") {
      return res.status(400).json({
        success: false,
        message: "Invalid publication-status filter.",
      });
    }

    const field = allowedSortFields.includes(sortBy)
      ? sortBy
      : "order";

    const direction = sortOrder === "desc" ? -1 : 1;

    const [labs, total] = await Promise.all([
      Lab.find(filter)
        .select("-theory")
        .sort({ [field]: direction, _id: 1 })
        .limit(100),

      Lab.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      labs,
    });
  } catch (error) {
    return respondToError(res, error, "Retrieving labs");
  }
};

// READ: get a single lab for the edit form.
export const getAdminLabById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID.",
      });
    }

    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    return res.status(200).json({
      success: true,
      lab,
    });
  } catch (error) {
    return respondToError(res, error, "Retrieving lab");
  }
};

// CREATE: save a new lab.
export const createLab = async (req, res) => {
  try {
    const { errors, data } = validateLab(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the lab form.",
        errors,
      });
    }

    // If the admin leaves order blank, append the new lab.
    if (data.order === undefined) {
      const lastLab = await Lab.findOne()
        .sort({ order: -1 })
        .select("order")
        .lean();

      data.order = lastLab ? lastLab.order + 1 : 1;
    }

    if (data.isPublished === undefined) {
      data.isPublished = true;
    }

    const lab = await Lab.create(data);

    return res.status(201).json({
      success: true,
      message: "Lab created successfully.",
      lab,
    });
  } catch (error) {
    return respondToError(res, error, "Creating lab");
  }
};

// UPDATE: modify an existing lab.
export const updateLab = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID.",
      });
    }

    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    const { errors, data } = validateLab(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the lab form.",
        errors,
      });
    }

    // Keep the existing order if the form leaves it blank.
    if (data.order === undefined) {
      data.order = lab.order;
    }

    if (data.isPublished === undefined) {
      data.isPublished = lab.isPublished;
    }

    lab.set(data);

    await lab.save();

    return res.status(200).json({
      success: true,
      message: "Lab updated successfully.",
      lab,
    });
  } catch (error) {
    return respondToError(res, error, "Updating lab");
  }
};

// DELETE: permanently delete unused labs, otherwise archive them.
export const deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID.",
      });
    }

    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    // Quiz history and completed-lab references must be preserved.
    const [hasAttempts, hasCompletionReferences] =
      await Promise.all([
        QuizAttempt.exists({ lab: lab._id }),
        User.exists({ completedLabIds: lab._id }),
      ]);

    if (hasAttempts || hasCompletionReferences) {
      if (lab.isPublished) {
        lab.isPublished = false;
        await lab.save();
      }

      return res.status(200).json({
        success: true,
        deleted: false,
        archived: true,
        message:
          "This lab has student history, so it was unpublished rather than permanently deleted.",
      });
    }

    // No historical references exist, so related questions can be removed.
    await QuizQuestion.deleteMany({ lab: lab._id });
    await Lab.deleteOne({ _id: lab._id });

    return res.status(200).json({
      success: true,
      deleted: true,
      archived: false,
      message:
        "Lab and its unused quiz questions were deleted.",
    });
  } catch (error) {
    return respondToError(res, error, "Deleting lab");
  }
};
