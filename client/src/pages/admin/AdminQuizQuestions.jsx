
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getAdminLab } from "../../services/adminLabService";

import {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} from "../../services/adminQuizService";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctOption: 0,
  explanation: "",
  topic: "",
  difficulty: "Beginner",
  order: "",
});

function AdminQuizQuestions() {
  const { labId } = useParams();

  const [lab, setLab] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState(emptyQuestion());
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setError("");

    try {
      const [labData, quizData] = await Promise.all([
        getAdminLab(labId),
        getAdminQuestions(labId),
      ]);

      setLab(labData.lab);
      setQuestions(quizData.questions);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load quiz management."
      );
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    initialLoad();
  }, [labId]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updateOption = (index, value) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map(
        (option, optionIndex) =>
          optionIndex === index ? value : option
      ),
    }));
  };

  const resetForm = () => {
    setForm(emptyQuestion());
    setEditingId(null);
  };

  const handleEdit = (question) => {
    setError("");
    setNotice("");

    setEditingId(question._id);

    setForm({
      question: question.question,
      options: [...question.options],
      correctOption: question.correctOption,
      explanation: question.explanation,
      topic: question.topic,
      difficulty: question.difficulty,
      order: question.order,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      question: form.question.trim(),
      options: form.options.map((option) => option.trim()),
      correctOption: Number(form.correctOption),
      explanation: form.explanation.trim(),
      topic: form.topic.trim(),
      difficulty: form.difficulty,
      ...(form.order !== ""
        ? { order: Number(form.order) }
        : {}),
    };

    try {
      const response = editingId
        ? await updateAdminQuestion(
          labId,
          editingId,
          payload
        )
        : await createAdminQuestion(
          labId,
          payload
        );

      setNotice(response.message);
      resetForm();
      await loadData();
    } catch (err) {
      const responseData = err.response?.data;

      const validationErrors = responseData?.errors
        ? Object.values(responseData.errors).join(" ")
        : "";

      setError(
        validationErrors ||
        responseData?.message ||
        "Failed to save the question."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    const confirmed = window.confirm(
      `Delete or archive Question ${question.order}? Questions with student attempts will be archived.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await deleteAdminQuestion(
        labId,
        question._id
      );

      setNotice(response.message);

      if (editingId === question._id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete the question."
      );
    }
  };

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">Loading quiz management...</p>
      </main>
    );
  }

  if (!lab) {
    return (
      <main className="main-content container">
        <div className="error">
          {error || "Lab not found."}
        </div>
      </main>
    );
  }

  const activeQuestions = questions.filter(
    (question) => question.isActive !== false
  );

  return (
    <main className="main-content container">
      <header className="page-header">
        <Link to="/admin/labs" className="muted">
          ← Back to Lab Management
        </Link>

        <p className="badge" style={{ marginTop: 14 }}>
          Quiz Management
        </p>

        <h1>{lab.title}</h1>

        <p>
          Create and manage multiple-choice questions for this lab.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
          }}
        >
          <span className="badge">
            {activeQuestions.length} active questions
          </span>

          <span className="badge">
            {questions.length} total questions
          </span>
        </div>
      </header>

      {error && (
        <div className="error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {notice && (
        <div className="admin-notice">
          {notice}
        </div>
      )}

      <section
        className="card card-padding"
        style={{ marginBottom: 24 }}
      >
        <h2>
          {editingId ? "Edit Question" : "Create Question"}
        </h2>

        {editingId && (
          <p className="muted">
            Questions with historical student attempts cannot be edited.
            Create a replacement and archive the old question instead.
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid">
          <div className="admin-field">
            <label htmlFor="question">Question *</label>

            <textarea
              id="question"
              name="question"
              rows={3}
              minLength={10}
              maxLength={1000}
              value={form.question}
              onChange={updateField}
              required
            />
          </div>

          <div className="grid grid-2">
            {form.options.map((option, index) => (
              <div className="admin-field" key={index}>
                <label htmlFor={`option-${index}`}>
                  Option {String.fromCharCode(65 + index)} *
                </label>

                <input
                  id={`option-${index}`}
                  value={option}
                  maxLength={300}
                  onChange={(event) =>
                    updateOption(index, event.target.value)
                  }
                  required
                />
              </div>
            ))}
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="correctOption">
                Correct Answer *
              </label>

              <select
                id="correctOption"
                name="correctOption"
                value={form.correctOption}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    correctOption: Number(event.target.value),
                  }))
                }
                required
              >
                {form.options.map((_, index) => (
                  <option value={index} key={index}>
                    Option {String.fromCharCode(65 + index)}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="topic">Topic *</label>

              <input
                id="topic"
                name="topic"
                value={form.topic}
                onChange={updateField}
                minLength={2}
                maxLength={100}
                placeholder="e.g. SQL Injection"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="difficulty">Difficulty *</label>

              <select
                id="difficulty"
                name="difficulty"
                value={form.difficulty}
                onChange={updateField}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="order">Question order</label>

              <input
                id="order"
                name="order"
                type="number"
                min={1}
                step={1}
                value={form.order}
                onChange={updateField}
                placeholder="Auto-append"
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="explanation">
              Answer Explanation *
            </label>

            <textarea
              id="explanation"
              name="explanation"
              rows={3}
              minLength={10}
              maxLength={2000}
              value={form.explanation}
              onChange={updateField}
              required
            />
          </div>

          <div className="admin-form-actions">
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Question"
                  : "Create Question"}
            </button>
          </div>
        </form>
      </section>

      <section className="page-header">
        <h2>Existing Questions</h2>
        <p>
          Review the correct answer and explanation for each question.
        </p>
      </section>

      <div className="grid">
        {questions.length === 0 ? (
          <div className="card card-padding">
            No questions have been created for this lab yet.
          </div>
        ) : (
          questions.map((question) => (
            <article
              className="card card-padding"
              key={question._id}
            >
              <div className="admin-section-heading">
                <div>
                  <span className="badge">
                    Question {question.order}
                  </span>

                  <span
                    className={
                      question.isActive === false
                        ? "badge badge-warning"
                        : "badge badge-success"
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {question.isActive === false
                      ? "Archived"
                      : "Active"}
                  </span>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={question.isActive === false}
                    onClick={() => handleEdit(question)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(question)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h3>{question.question}</h3>

              <div className="grid grid-2">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={
                      index === question.correctOption
                        ? "option option-selected"
                        : "option"
                    }
                  >
                    <span>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                ))}
              </div>

              <p>
                <strong>Correct answer:</strong>{" "}
                {String.fromCharCode(65 + question.correctOption)}
              </p>

              <p>
                <strong>Topic:</strong> {question.topic}
              </p>

              <p>
                <strong>Explanation:</strong>{" "}
                {question.explanation}
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default AdminQuizQuestions;
