import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

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

  const handleAnswerChange = (questionId, optionIndex) => {
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
      const formattedAnswers = quiz.questions.map(
        (question) => ({
          questionId: question._id,
          selectedOption:
            answers[question._id] ?? -1,
        })
      );

      const data = await submitQuiz(
        labId,
        formattedAnswers
      );
      const currentUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          points: data.totalPoints,
          completedLabs: data.completedLabs,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }
      setResult(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (result) {
    return (
      <div>
        <Link to="/labs">
          ← Back to Labs
        </Link>

        <h1>Quiz Complete 🎉</h1>

        <h2>
          {result.score} / {result.totalQuestions}
        </h2>

        <p>{result.percentage}%</p>

        <h2>
          {result.score} / {result.totalQuestions}
        </h2>

        <p>{result.percentage}%</p>

        <div>
          <h3>Points</h3>

          {result.pointsAwarded > 0 ? (
            <>
              <p>
                🎉 You earned {result.pointsAwarded} points!
              </p>

              <p>
                Total points: {result.totalPoints}
              </p>
            </>
          ) : (
            <>
              <p>
                This lab has already been completed.
              </p>

              <p>
                No additional points were awarded.
              </p>

              <p>
                Total points: {result.totalPoints}
              </p>
            </>
          )}
        </div>

        {result.results.map((item, index) => (
          <div key={item.questionId}>
            <h3>
              {index + 1}. {item.question}
            </h3>

            <p>
              {item.isCorrect
                ? "✅ Correct"
                : "❌ Incorrect"}
            </p>

            {!item.isCorrect && (
              <p>
                Correct option:{" "}
                {item.correctOption + 1}
              </p>
            )}

            <p>{item.explanation}</p>

            <hr />
          </div>
        ))}

        <Link to="/labs">
          Return to Labs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/labs">
        ← Back to Labs
      </Link>

      <h1>{quiz.lab.title} Quiz</h1>

      <p>
        {quiz.totalQuestions} questions
      </p>

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={question._id}>
            <h2>
              {index + 1}. {question.question}
            </h2>

            {question.options.map(
              (option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={question._id}
                    value={optionIndex}
                    checked={
                      answers[question._id] ===
                      optionIndex
                    }
                    onChange={() =>
                      handleAnswerChange(
                        question._id,
                        optionIndex
                      )
                    }
                  />

                  {option}
                </label>
              )
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit Quiz"}
        </button>
      </form>
    </div>
  );
}

export default Quiz;