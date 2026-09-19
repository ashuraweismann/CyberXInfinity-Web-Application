import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getLeaderboard } from "../services/leaderboardService";

function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const result = await getLeaderboard();
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
    return <p>Loading leaderboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Link to="/dashboard">
        ← Dashboard
      </Link>

      <h1>🏆 CyberXInfinity Leaderboard</h1>

      {data?.currentUser && (
        <section>
          <h2>Your Ranking</h2>

          <p>
            Rank: #{data.currentUser.rank}
          </p>

          <p>
            Points: {data.currentUser.points}
          </p>

          <p>
            Labs Completed:{" "}
            {data.currentUser.completedLabs} / 4
          </p>
        </section>
      )}

      <hr />

      <section>
        <h2>Top Players</h2>

        {data?.leaderboard?.length === 0 ? (
          <p>No players found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Points</th>
                <th>Labs</th>
              </tr>
            </thead>

            <tbody>
              {data.leaderboard.map((player) => {
                const isCurrentUser =
                  player.id ===
                  data.currentUser.id;

                return (
                  <tr
                    key={player.id}
                    style={{
                      fontWeight: isCurrentUser
                        ? "bold"
                        : "normal",
                    }}
                  >
                    <td>
                      {player.rank}
                    </td>

                    <td>
                      {player.username}

                      {isCurrentUser && (
                        <span> (You)</span>
                      )}
                    </td>

                    <td>
                      {player.points}
                    </td>

                    <td>
                      {player.completedLabs}/4
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Leaderboard;