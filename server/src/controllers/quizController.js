import QuizQuestion from "../models/QuizQuestion.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Lab from "../models/Lab.js";
import { awardLabPoints } from "../services/gamificationService.js";

// Get quiz questions for a lab
export const getQuizByLab = async (req, res) => {
  try {
    const { labId } = req.params;

    const lab = await Lab.findOne({
      _id: labId,
      isPublished: true,
    });

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    const questions = await QuizQuestion.find({
      lab: labId,
    })
      .select("_id question options difficulty topic order")
      .sort({ order: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quiz questions found for this lab.",
      });
    }

    return res.status(200).json({
      success: true,
      lab: {
        id: lab._id,
        title: lab.title,
        slug: lab.slug,
      },
      totalQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve quiz.",
    });
  }
};

// Submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { labId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    const questions = await QuizQuestion.find({
      lab: labId,
    }).sort({ order: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    // Create lookup for submitted answers
    const submittedAnswers = new Map();

    for (const answer of answers) {
      if (!answer.questionId) {
        continue;
      }

      submittedAnswers.set(
        answer.questionId.toString(),
        answer.selectedOption
      );
    }

    let correctAnswers = 0;

    const evaluatedAnswers = questions.map((question) => {
      const selectedOption = submittedAnswers.get(
        question._id.toString()
      );

      const isAnswered =
        Number.isInteger(selectedOption) &&
        selectedOption >= 0 &&
        selectedOption <= 3;

      const isCorrect =
        isAnswered &&
        selectedOption === question.correctOption;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        question: question._id,
        selectedOption: isAnswered ? selectedOption : -1,
        isCorrect,
      };
    });

    const totalQuestions = questions.length;

    const percentage = Math.round(
      (correctAnswers / totalQuestions) * 100
    );

    const attempt = await QuizAttempt.create({
      user: req.user.userId,
      lab: labId,
      answers: evaluatedAnswers,
      score: correctAnswers,
      totalQuestions,
      percentage,
    });

    const reward = await awardLabPoints({
      userId: req.user.userId,
      labId,
      score: correctAnswers,
      totalQuestions,
    });

    const results = questions.map((question) => {
      const submitted = evaluatedAnswers.find(
        (answer) =>
          answer.question.toString() === question._id.toString()
      );

      return {
        questionId: question._id,
        question: question.question,
        selectedOption: submitted.selectedOption,
        correctOption: question.correctOption,
        isCorrect: submitted.isCorrect,
        explanation: question.explanation,
        topic: question.topic,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully.",

      attemptId: attempt._id,
      score: correctAnswers,
      totalQuestions,
      percentage,
      pointsAwarded: reward.pointsAwarded,
      totalPoints: reward.totalPoints,
      completedLabs: reward.completedLabs,
      alreadyCompleted: reward.alreadyCompleted,
      pointBreakdown: reward.breakdown ?? null,
      results,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
    });
  }
};