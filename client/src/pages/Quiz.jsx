import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router";

import {
  getQuizByLab,
  submitQuiz,
} from "../services/quizService";

function Quiz() {
  const { labId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await getQuizByLab(labId);
        setQuiz(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load quiz."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [labId]);

  const handleAnswerChange = (
    questionId,
    optionIndex
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quiz) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formattedAnswers =
        quiz.questions.map((question) => ({
          questionId: question._id,
          selectedOption:
            answers[question._id] ?? -1,
        }));

      const data = await submitQuiz(
        labId,
        formattedAnswers
      );

      // Keep cached user information in sync
      const currentUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          points: data.totalPoints,
          completedLabs:
            data.completedLabs,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      setResult(data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getQuestionById = (questionId) => {
    return quiz?.questions.find(
      (question) =>
        question._id === questionId
    );
  };

  const getAnswerText = (
    questionId,
    optionIndex
  ) => {
    const question =
      getQuestionById(questionId);

    if (!question || optionIndex < 0) {
      return "Not answered";
    }

    return (
      question.options[optionIndex] ||
      "Unknown option"
    );
  };

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">
          Loading quiz...
        </p>
      </main>
    );
  }

  if (error && !quiz) {
    return (
      <main className="main-content container">
        <div className="error">
          {error}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            to="/labs"
            className="btn btn-secondary"
          >
            ← Back to Labs
          </Link>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return null;
  }

  // --------------------------------------------------
  // QUIZ RESULT
  // --------------------------------------------------

  if (result) {
    return (
      <main className="main-content container">
        <div className="page-header">
          <Link
            to="/labs"
            className="muted"
          >
            ← Back to Labs
          </Link>
        </div>

        <section className="card quiz-result-score">
          <span className="badge">
            Quiz Completed
          </span>

          <h1>
            {result.percentage}%
          </h1>

          <p className="muted">
            {result.score} /{" "}
            {result.totalQuestions} correct
          </p>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <span className="badge badge-success">
              +{result.pointsAwarded} points
            </span>

            <span className="badge">
              Total: {result.totalPoints}
            </span>
          </div>
        </section>

        {/* AI FEEDBACK */}
        <section
          className="card card-padding ai-card"
          style={{ marginTop: 20 }}
        >
          <h2>
            🤖 AI Learning Suggestions
          </h2>

          {result.aiSuggestion ? (
            <>
              <p>
                {result.aiSuggestion.summary}
              </p>

              {result.aiSuggestion
                .strengths?.length > 0 && (
                <>
                  <h3>
                    💪 Your Strengths
                  </h3>

                  <ul>
                    {result.aiSuggestion.strengths.map(
                      (strength, index) => (
                        <li key={index}>
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              {result.aiSuggestion
                .weakTopics?.length > 0 && (
                <>
                  <h3>
                    📚 Topics to Review
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {result.aiSuggestion.weakTopics.map(
                      (topic) => (
                        <span
                          key={topic}
                          className="badge badge-warning"
                        >
                          {topic}
                        </span>
                      )
                    )}
                  </div>
                </>
              )}

              {result.aiSuggestion
                .recommendations?.length > 0 && (
                <>
                  <h3
                    style={{
                      marginTop: 24,
                    }}
                  >
                    🎯 Recommendations
                  </h3>

                  <ul>
                    {result.aiSuggestion.recommendations.map(
                      (
                        recommendation,
                        index
                      ) => (
                        <li key={index}>
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              <h3
                style={{
                  marginTop: 24,
                }}
              >
                ➡️ Next Step
              </h3>

              <p
                style={{
                  color:
                    "var(--primary)",
                  fontWeight: 600,
                }}
              >
                {
                  result.aiSuggestion
                    .nextStep
                }
              </p>
            </>
          ) : (
            <p className="muted">
              AI feedback is temporarily
              unavailable. Your quiz result
              has still been saved.
            </p>
          )}
        </section>

        {/* ANSWER REVIEW */}
        <section style={{ marginTop: 28 }}>
          <div className="page-header">
            <h2>Answer Review</h2>

            <p>
              Review your answers and learn
              from your mistakes.
            </p>
          </div>

          <div className="grid">
            {result.results.map(
              (item, index) => {
                const questionClass =
                  item.isCorrect
                    ? "answer-correct"
                    : "answer-wrong";

                return (
                  <article
                    key={item.questionId}
                    className={`card card-padding ${questionClass}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 16,
                      }}
                    >
                      <span className="badge">
                        Question{" "}
                        {index + 1}
                      </span>

                      <span
                        className={
                          item.isCorrect
                            ? "badge badge-success"
                            : "badge"
                        }
                        style={
                          !item.isCorrect
                            ? {
                                color:
                                  "var(--danger)",
                                background:
                                  "rgba(251, 113, 133, 0.1)",
                              }
                            : undefined
                        }
                      >
                        {item.isCorrect
                          ? "✓ Correct"
                          : "✕ Incorrect"}
                      </span>
                    </div>

                    <h3
                      style={{
                        lineHeight: 1.5,
                        marginTop: 16,
                      }}
                    >
                      {item.question}
                    </h3>

                    <div
                      style={{
                        marginTop: 18,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div>
                        <span className="muted">
                          Your answer
                        </span>

                        <p
                          style={{
                            marginTop: 5,
                          }}
                        >
                          {getAnswerText(
                            item.questionId,
                            item.selectedOption
                          )}
                        </p>
                      </div>

                      {!item.isCorrect && (
                        <div>
                          <span className="muted">
                            Correct answer
                          </span>

                          <p
                            style={{
                              marginTop: 5,
                              color:
                                "var(--success)",
                              fontWeight: 600,
                            }}
                          >
                            {getAnswerText(
                              item.questionId,
                              item.correctOption
                            )}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="muted">
                          Explanation
                        </span>

                        <p
                          style={{
                            lineHeight: 1.7,
                            marginTop: 5,
                          }}
                        >
                          {item.explanation}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 16,
                      }}
                    >
                      <span className="badge">
                        {item.topic}
                      </span>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 32,
          }}
        >
          <Link
            to="/labs"
            className="btn btn-secondary"
          >
            ← Back to Labs
          </Link>

          <Link
            to={`/labs/${labId}`}
            className="btn btn-primary"
          >
            Review This Lab →
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ACTIVE QUIZ
  // --------------------------------------------------

  const answeredCount =
    Object.keys(answers).length;

  const progressPercentage =
    quiz.totalQuestions > 0
      ? Math.round(
          (answeredCount /
            quiz.totalQuestions) *
            100
        )
      : 0;

  return (
    <main className="main-content container">
      {/* HEADER */}
      <section className="quiz-header">
        <div>
          <Link
            to="/labs"
            className="muted"
          >
            ← Back to Labs
          </Link>

          <h1
            style={{
              margin: "12px 0 6px",
            }}
          >
            {quiz.lab.title} Quiz
          </h1>

          <p className="muted">
            Test your knowledge of this lab.
          </p>
        </div>

        <span className="badge">
          {quiz.totalQuestions} Questions
        </span>
      </section>

      {/* PROGRESS */}
      <section
        className="card card-padding quiz-progress"
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span>
            Quiz Progress
          </span>

          <span className="muted">
            {answeredCount}/
            {quiz.totalQuestions}
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        <p
          className="muted"
          style={{
            marginBottom: 0,
            marginTop: 8,
          }}
        >
          {progressPercentage}% completed
        </p>
      </section>

      {/* ERROR */}
      {error && (
        <div
          className="error"
          style={{
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* QUESTIONS */}
      <form onSubmit={handleSubmit}>
        <div className="grid">
          {quiz.questions.map(
            (question, index) => {
              const selectedAnswer =
                answers[question._id];

              return (
                <article
                  key={question._id}
                  className="card question-card"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: 12,
                    }}
                  >
                    <span className="badge">
                      Question {index + 1}
                    </span>

                    <span className="badge">
                      {question.difficulty}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: 1.5,
                      marginTop: 18,
                    }}
                  >
                    {question.question}
                  </h2>

                  <span className="muted">
                    Topic: {question.topic}
                  </span>

                  <div className="question-options">
                    {question.options.map(
                      (
                        option,
                        optionIndex
                      ) => {
                        const selected =
                          selectedAnswer ===
                          optionIndex;

                        return (
                          <label
                            key={optionIndex}
                            className={`option ${
                              selected
                                ? "option-selected"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={
                                question._id
                              }
                              value={
                                optionIndex
                              }
                              checked={
                                selected
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  question._id,
                                  optionIndex
                                )
                              }
                            />

                            <span>
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}.{" "}
                              {option}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>

        {/* SUBMIT */}
        <section
          className="card card-padding"
          style={{
            marginTop: 24,
            textAlign: "center",
          }}
        >
          <h2>
            Ready to submit?
          </h2>

          <p className="muted">
            You have answered{" "}
            <strong>
              {answeredCount}
            </strong>{" "}
            of{" "}
            <strong>
              {quiz.totalQuestions}
            </strong>{" "}
            questions.
          </p>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              submitting ||
              answeredCount === 0
            }
          >
            {submitting
              ? "Submitting Quiz..."
              : "Submit Quiz →"}
          </button>
        </section>
      </form>
    </main>
  );
}

export default Quiz;
