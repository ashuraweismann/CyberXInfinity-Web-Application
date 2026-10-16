import { useEffect, useState } from "react";

import { getLeaderboard } from "../services/leaderboardService";

function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const result =
          await getLeaderboard();

        setData(result);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load leaderboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">
          Loading leaderboard...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content container">
        <div className="error">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="main-content container">
      <section className="page-header">
        <p className="badge">
          Competition
        </p>

        <h1>🏆 Leaderboard</h1>

        <p>
          Complete labs, earn points, and track
          your position.
        </p>
      </section>

      <section className="grid grid-3">
        <div className="card card-padding">
          <p className="muted">Your Rank</p>
          <h2>
            {data.currentUser.eligible
              ? `#${data.currentUser.rank}`
              : "Not ranked"}
          </h2>

          <p className="muted">
            {data.currentUser.eligible
              ? "Your student leaderboard position"
              : "Admin accounts are excluded from student rankings."}
          </p>
        </div>

        <div className="card card-padding">
          <p className="muted">Your Points</p>
          <h2>
            {data.currentUser.points}
          </h2>
        </div>

        <div className="card card-padding">
          <p className="muted">
            Labs Completed
          </p>
          <h2>
            {data.currentUser.completedLabs}/4
          </h2>
        </div>
      </section>

      <section
        className="card"
        style={{
          marginTop: 24,
          overflow: "hidden",
        }}
      >
        <div className="card-padding">
          <h2>Top Players</h2>
        </div>

        {data.leaderboard.map(
          (player) => {
            const isCurrentUser =
              player.id ===
              data.currentUser.id;

            return (
              <div
                key={player.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "70px 1fr 120px 90px",
                  gap: 16,
                  alignItems: "center",
                  padding: "16px 22px",

                  borderTop:
                    "1px solid var(--border)",

                  background: isCurrentUser
                    ? "rgba(34, 211, 238, 0.07)"
                    : "transparent",
                }}
              >
                <strong>
                  #{player.rank}
                </strong>

                <div>
                  <strong>
                    {player.username}
                  </strong>

                  {isCurrentUser && (
                    <span
                      className="badge"
                      style={{
                        marginLeft: 8,
                      }}
                    >
                      You
                    </span>
                  )}
                </div>

                <strong>
                  {player.points} pts
                </strong>

                <span className="muted">
                  {player.completedLabs}/4
                </span>
              </div>
            );
          }
        )}
      </section>
    </main>
  );
}

export default Leaderboard;