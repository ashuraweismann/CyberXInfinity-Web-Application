import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

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

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        if (error.response?.status === 401) {
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

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content container">
        <div className="error">{error}</div>
      </main>
    );
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
    <main className="main-content container">
      <section className="page-header">
        <p className="badge">
          Cybersecurity Learning Platform
        </p>

        <h1>
          Welcome back, {user.name} 👋
        </h1>

        <p>
          Continue learning, complete labs, and
          climb the leaderboard.
        </p>
      </section>

      <section className="grid grid-4">
        <div className="card card-padding">
          <p className="muted">⭐ Points</p>
          <h2>{user.points}</h2>
        </div>

        <div className="card card-padding">
          <p className="muted">🏆 Rank</p>
          <h2>
            {user.rank == null ? "Not ranked" : `#${user.rank}`}
          </h2>
        </div>

        <div className="card card-padding">
          <p className="muted">📚 Labs</p>
          <h2>
            {progress.completedLabs}/
            {progress.totalLabs}
          </h2>
        </div>

        <div className="card card-padding">
          <p className="muted">📈 Progress</p>
          <h2>{progress.percentage}%</h2>
        </div>
      </section>

      <section
        className="card card-padding"
        style={{ marginTop: 20 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div>
            <h2>Learning Progress</h2>
            <p className="muted">
              {progress.completedLabs} of{" "}
              {progress.totalLabs} labs completed
            </p>
          </div>

          <span className="badge">
            {progress.percentage}%
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progress.percentage}%`,
            }}
          />
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2>Your Labs</h2>
            <p className="muted">
              Continue where you left off.
            </p>
          </div>

          <Link
            to="/labs"
            className="btn btn-secondary"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-2">
          {labs.map((lab) => (
            <article
              key={lab.id}
              className="card card-padding"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 12,
                }}
              >
                <span className="badge">
                  Lab {lab.order}
                </span>

                {lab.completed && (
                  <span className="badge badge-success">
                    ✓ Completed
                  </span>
                )}
              </div>

              <h3>{lab.title}</h3>

              <p className="muted">
                {lab.description}
              </p>

              <p className="muted">
                {lab.difficulty} ·{" "}
                {lab.estimatedTime} min
              </p>

              <Link
                to={`/labs/${lab.slug}`}
                className="btn btn-primary"
              >
                {lab.completed
                  ? "Review Lab"
                  : "Start Lab"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="grid grid-2"
        style={{ marginTop: 28 }}
      >
        <div className="card card-padding">
          <h2>Latest Quiz</h2>

          {!latestAttempt ? (
            <p className="muted">
              Complete your first quiz to see your
              results here.
            </p>
          ) : (
            <>
              <p className="muted">
                {latestAttempt.lab?.title}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div>
                  <h2>
                    {latestAttempt.score}/
                    {latestAttempt.totalQuestions}
                  </h2>

                  <p className="muted">
                    {latestAttempt.percentage}%
                  </p>
                </div>

                <Link
                  to={`/labs/${latestAttempt.lab?.slug}`}
                  className="btn btn-secondary"
                >
                  Review Lab
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="card card-padding">
          <h2>🤖 AI Learning Suggestion</h2>

          {!latestAttempt?.aiSuggestion ? (
            <p className="muted">
              Complete a quiz to receive personalized
              learning guidance.
            </p>
          ) : (
            <>
              <p>
                {latestAttempt.aiSuggestion.summary}
              </p>

              {latestAttempt.aiSuggestion
                .weakTopics?.length > 0 && (
                  <>
                    <p className="muted">
                      Focus areas
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {latestAttempt.aiSuggestion
                        .weakTopics.map(
                          (topic) => (
                            <span
                              className="badge badge-warning"
                              key={topic}
                            >
                              {topic}
                            </span>
                          )
                        )}
                    </div>
                  </>
                )}

              <p
                style={{
                  marginTop: 16,
                  color: "var(--primary)",
                }}
              >
                Next:{" "}
                {
                  latestAttempt.aiSuggestion
                    .nextStep
                }
              </p>
            </>
          )}
        </div>
      </section>

      <section
        className="card card-padding"
        style={{ marginTop: 28 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Recent Quiz Attempts</h2>
            <p className="muted">
              Your latest learning activity.
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="btn btn-secondary"
          >
            🏆 Leaderboard
          </Link>
        </div>

        {recentAttempts.length === 0 ? (
          <p className="muted">
            No quiz attempts yet.
          </p>
        ) : (
          <div style={{ marginTop: 16 }}>
            {recentAttempts.map((attempt) => (
              <div
                key={attempt._id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom:
                    "1px solid var(--border)",
                }}
              >
                <div>
                  <strong>
                    {attempt.lab?.title}
                  </strong>

                  <p className="muted">
                    {new Date(
                      attempt.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong>
                    {attempt.score}/
                    {attempt.totalQuestions}
                  </strong>

                  <p className="muted">
                    {attempt.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;