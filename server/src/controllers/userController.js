import User from "../models/User.js";
import Lab from "../models/Lab.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id name username email points completedLabs completedLabIds"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user.",
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current user
    const user = await User.findById(userId).select(
      "_id name username email points completedLabs completedLabIds"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Count users with more points than current user
    const usersAhead = await User.countDocuments({
      points: {
        $gt: user.points,
      },
    });

    const rank = usersAhead + 1;

    // Get all published labs
    const labs = await Lab.find({
      isPublished: true,
    })
      .select(
        "_id title slug description difficulty estimatedTime order"
      )
      .sort({ order: 1 });

    // Convert completed lab IDs to strings for easy comparison
    const completedLabIds = user.completedLabIds.map(
      (id) => id.toString()
    );

    const labProgress = labs.map((lab) => ({
      id: lab._id,
      title: lab.title,
      slug: lab.slug,
      description: lab.description,
      difficulty: lab.difficulty,
      estimatedTime: lab.estimatedTime,
      order: lab.order,
      completed: completedLabIds.includes(
        lab._id.toString()
      ),
    }));

    // Get the student's latest quiz attempts
    const recentAttempts = await QuizAttempt.find({
      user: userId,
    })
      .populate("lab", "title slug order")
      .select(
        "_id lab score totalQuestions percentage aiSuggestion createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    const totalLabs = labs.length;

    const progressPercentage =
      totalLabs > 0
        ? Math.round(
            (user.completedLabs / totalLabs) * 100
          )
        : 0;

    const latestAttempt =
      recentAttempts.length > 0
        ? recentAttempts[0]
        : null;

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        points: user.points,
        completedLabs: user.completedLabs,
        rank,
      },

      progress: {
        completedLabs: user.completedLabs,
        totalLabs,
        percentage: progressPercentage,
      },

      labs: labProgress,

      recentAttempts,

      latestAttempt,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};