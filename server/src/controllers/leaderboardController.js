
import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Only student accounts can appear on the leaderboard.
    const users = await User.find({
      role: "student",
    })
      .select("_id name username points completedLabs")
      .sort({
        points: -1,
        completedLabs: -1,
        username: 1,
      })
      .limit(100);

    // Competition ranking: 1, 2, 2, 4.
    let rank = 0;
    let previousPoints = null;

    const leaderboard = users.map((user, index) => {
      if (previousPoints !== user.points) {
        rank = index + 1;
        previousPoints = user.points;
      }

      return {
        rank,
        id: user._id,
        name: user.name,
        username: user.username,
        points: user.points,
        completedLabs: user.completedLabs,
      };
    });

    const currentUser = await User.findById(
      req.user.userId
    ).select(
      "_id name username role points completedLabs"
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Admins have no student leaderboard rank.
    const isRanked = currentUser.role === "student";

    const usersAhead = isRanked
      ? await User.countDocuments({
        role: "student",
        points: { $gt: currentUser.points },
      })
      : null;

    return res.status(200).json({
      success: true,
      leaderboard,
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        role: currentUser.role,
        points: currentUser.points,
        completedLabs: currentUser.completedLabs,
        rank: isRanked ? usersAhead + 1 : null,
        eligible: isRanked,
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leaderboard.",
    });
  }
};
