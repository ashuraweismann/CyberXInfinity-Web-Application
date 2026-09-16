import User from "../models/User.js";

const CORRECT_ANSWER_POINTS = 10;
const QUIZ_COMPLETION_POINTS = 25;
const PERFECT_SCORE_BONUS = 25;

export const calculateQuizPoints = ({
  score,
  totalQuestions,
}) => {
  const answerPoints =
    score * CORRECT_ANSWER_POINTS;

  const completionPoints =
    QUIZ_COMPLETION_POINTS;

  const perfectBonus =
    score === totalQuestions
      ? PERFECT_SCORE_BONUS
      : 0;

  return {
    answerPoints,
    completionPoints,
    perfectBonus,
    total:
      answerPoints +
      completionPoints +
      perfectBonus,
  };
};

export const awardLabPoints = async ({
  userId,
  labId,
  score,
  totalQuestions,
}) => {
  const calculated = calculateQuizPoints({
    score,
    totalQuestions,
  });

  /*
   * Only award points if this lab has not
   * already been completed by the user.
   *
   * $ne prevents repeated attempts from
   * awarding the same reward.
   */
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      completedLabIds: {
        $ne: labId,
      },
    },
    {
      $inc: {
        points: calculated.total,
        completedLabs: 1,
      },

      $addToSet: {
        completedLabIds: labId,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return {
      pointsAwarded: 0,
      alreadyCompleted: true,
      totalPoints:
        (await User.findById(userId).select("points"))
          ?.points ?? 0,
    };
  }

  return {
    pointsAwarded: calculated.total,
    alreadyCompleted: false,
    breakdown: calculated,
    totalPoints: user.points,
    completedLabs: user.completedLabs,
  };
};