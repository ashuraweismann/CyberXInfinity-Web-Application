import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { getDashboard } from "../services/userService";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();

        setDashboard(data);

        // Keep local user data synchronized
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return null;
  }

  const {
    user,
    progress,
    labs,
    recentAttempts,
    latestAttempt,
  } = dashboard;

  return (
    <div>
      {/* Header */}
      <header>
        <div>
          <h1>CyberXInfinity</h1>
          <p>
            Cybersecurity Learning Platform
          </p>
        </div>

        <div>
          <span>
            {user.username}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        {/* Welcome */}
        <section>
          <h2>
            Welcome back, {user.name} 👋
          </h2>

          <p>
            Keep learning and improve your
            cybersecurity skills.
          </p>
        </section>

        {/* Stats */}
        <section>
          <div>
            <h3>⭐ Points</h3>
            <p>{user.points}</p>
          </div>

          <div>
            <h3>🏆 Rank</h3>
            <p>#{user.rank}</p>
          </div>

          <div>
            <h3>📚 Labs</h3>
            <p>
              {progress.completedLabs} /{" "}
              {progress.totalLabs}
            </p>
          </div>

          <div>
            <h3>📈 Progress</h3>
            <p>
              {progress.percentage}%
            </p>
          </div>
        </section>

        {/* Progress */}
        <section>
          <h2>Learning Progress</h2>

          <div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "#ddd",
              }}
            >
              <div
                style={{
                  width: `${progress.percentage}%`,
                  height: "100%",
                  background: "#333",
                }}
              />
            </div>
          </div>

          <p>
            {progress.completedLabs} of{" "}
            {progress.totalLabs} labs completed
          </p>
        </section>

        {/* Labs */}
        <section>
          <div>
            <h2>Your Labs</h2>

            <Link to="/labs">
              View All Labs
            </Link>
          </div>

          {labs.map((lab) => (
            <article key={lab.id}>
              <div>
                <span>
                  Lab {lab.order}
                </span>

                {lab.completed && (
                  <span>
                    ✅ Completed
                  </span>
                )}
              </div>

              <h3>{lab.title}</h3>

              <p>
                {lab.description}
              </p>

              <p>
                {lab.difficulty} ·{" "}
                {lab.estimatedTime} min
              </p>

              <Link
                to={`/labs/${lab.slug}`}
              >
                {lab.completed
                  ? "Review Lab"
                  : "Start Lab"}
              </Link>
            </article>
          ))}
        </section>

        {/* Latest Quiz */}
        <section>
          <h2>Latest Quiz Result</h2>

          {!latestAttempt ? (
            <p>
              You haven't completed a quiz yet.
            </p>
          ) : (
            <div>
              <h3>
                {latestAttempt.lab?.title ||
                  "Quiz"}
              </h3>

              <p>
                Score:{" "}
                {latestAttempt.score}/
                {latestAttempt.totalQuestions}
              </p>

              <p>
                {latestAttempt.percentage}%
              </p>
            </div>
          )}
        </section>

        {/* AI Feedback */}
        <section>
          <h2>🤖 AI Learning Suggestion</h2>

          {!latestAttempt?.aiSuggestion ? (
            <p>
              Complete a quiz to receive
              personalized learning suggestions.
            </p>
          ) : (
            <div>
              <h3>
                {latestAttempt.lab?.title}
              </h3>

              <p>
                {latestAttempt.aiSuggestion.summary}
              </p>

              {latestAttempt.aiSuggestion
                .weakTopics.length > 0 && (
                <>
                  <h4>
                    Topics to Review
                  </h4>

                  <ul>
                    {latestAttempt.aiSuggestion
                      .weakTopics.map(
                        (topic, index) => (
                          <li key={index}>
                            {topic}
                          </li>
                        )
                      )}
                  </ul>
                </>
              )}

              <Link
                to={`/labs/${latestAttempt.lab?.slug}`}
              >
                Continue Learning
              </Link>
            </div>
          )}
        </section>

        {/* Recent Quiz Attempts */}
        <section>
          <h2>Recent Quiz Attempts</h2>

          {recentAttempts.length === 0 ? (
            <p>
              No quiz attempts yet.
            </p>
          ) : (
            recentAttempts.map((attempt) => (
              <article key={attempt._id}>
                <h3>
                  {attempt.lab?.title ||
                    "Quiz"}
                </h3>

                <p>
                  {attempt.score}/
                  {attempt.totalQuestions}
                </p>

                <p>
                  {attempt.percentage}%
                </p>

                <p>
                  {new Date(
                    attempt.createdAt
                  ).toLocaleDateString()}
                </p>
              </article>
            ))
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2>Quick Actions</h2>

          <Link to="/labs">
            📚 Explore Labs
          </Link>

          {" · "}

          <Link to="/leaderboard">
            🏆 View Leaderboard
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;