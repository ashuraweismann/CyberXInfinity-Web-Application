import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Get top 100 users
    const users = await User.find({})
      .select("_id name username points completedLabs")
      .sort({
        points: -1,
        completedLabs: -1,
        username: 1,
      })
      .limit(100);

    let currentRank = 0;
    let previousPoints = null;

    const leaderboard = users.map((user, index) => {
      if (previousPoints !== user.points) {
        currentRank = index + 1;
        previousPoints = user.points;
      }

      return {
        rank: currentRank,
        id: user._id,
        name: user.name,
        username: user.username,
        points: user.points,
        completedLabs: user.completedLabs,
      };
    });

    // Get the logged-in user's current points
    const currentUser = await User.findById(req.user.userId)
      .select("_id name username points completedLabs");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Competition ranking:
    // users with more points determine the rank
    const usersAhead = await User.countDocuments({
      points: {
        $gt: currentUser.points,
      },
    });

    const currentUserRank = usersAhead + 1;

    return res.status(200).json({
      success: true,
      leaderboard,
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        points: currentUser.points,
        completedLabs: currentUser.completedLabs,
        rank: currentUserRank,
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