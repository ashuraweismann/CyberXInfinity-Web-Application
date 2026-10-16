
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  createAdminLab,
  getAdminLab,
  getAdminLabs,
  updateAdminLab,
} from "../../services/adminLabService";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  difficulty: "Beginner",
  estimatedTime: 30,
  order: "",
  isPublished: true,
  keyConceptsText: "",
  theory: [
    {
      title: "",
      content: "",
    },
  ],
};

function AdminLabForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (isEditing) {
          const data = await getAdminLab(id);
          const lab = data.lab;

          setForm({
            title: lab.title,
            slug: lab.slug,
            description: lab.description,
            difficulty: lab.difficulty,
            estimatedTime: lab.estimatedTime,
            order: lab.order,
            isPublished: lab.isPublished,
            keyConceptsText: lab.keyConcepts.join(", "),
            theory: lab.theory.map((section) => ({
              title: section.title,
              content: section.content,
            })),
          });
        } else {
          const data = await getAdminLabs({
            sortBy: "order",
            sortOrder: "desc",
            status: "all",
          });

          const nextOrder = data.labs.reduce(
            (maximum, lab) => Math.max(maximum, lab.order),
            0
          ) + 1;

          setForm((previous) => ({
            ...previous,
            order: nextOrder,
          }));
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load the lab form."
        );
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id, isEditing]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateTheory = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      theory: previous.theory.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, [field]: value }
          : section
      ),
    }));
  };

  const addTheorySection = () => {
    setForm((previous) => ({
      ...previous,
      theory: [
        ...previous.theory,
        { title: "", content: "" },
      ],
    }));
  };

  const removeTheorySection = (index) => {
    setForm((previous) => ({
      ...previous,
      theory: previous.theory.filter(
        (_, sectionIndex) => sectionIndex !== index
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      estimatedTime: Number(form.estimatedTime),
      ...(form.order !== "" ? { order: Number(form.order) } : {}),
      isPublished: form.isPublished,
      keyConcepts: form.keyConceptsText
        .split(",")
        .map((concept) => concept.trim())
        .filter(Boolean),
      theory: form.theory.map((section) => ({
        title: section.title.trim(),
        content: section.content.trim(),
      })),
    };

    try {
      if (isEditing) {
        await updateAdminLab(id, payload);
      } else {
        await createAdminLab(payload);
      }

      navigate("/admin/labs");
    } catch (err) {
      const responseData = err.response?.data;

      const validationErrors = responseData?.errors
        ? Object.values(responseData.errors).join(" ")
        : "";

      setError(
        validationErrors ||
        responseData?.message ||
        "Failed to save the lab."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">Loading lab...</p>
      </main>
    );
  }

  return (
    <main className="main-content container">
      <header className="page-header">
        <Link to="/admin/labs" className="muted">
          ← Back to Lab Management
        </Link>

        <h1 style={{ marginTop: 12 }}>
          {isEditing ? "Edit Lab" : "Create Lab"}
        </h1>

        <p>
          Maintain the lab metadata, theory and key concepts.
        </p>
      </header>

      {error && (
        <div className="error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid">
        <section className="card card-padding">
          <h2>Lab Information</h2>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={updateField}
                minLength={3}
                maxLength={120}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="Generated from title if blank"
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
              <label htmlFor="estimatedTime">
                Estimated minutes *
              </label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="number"
                min={1}
                max={600}
                value={form.estimatedTime}
                onChange={updateField}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="order">Display order</label>
              <input
                id="order"
                name="order"
                type="number"
                min={1}
                step={1}
                value={form.order}
                onChange={updateField}
                placeholder="Automatically appended if blank"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="keyConceptsText">
                Key concepts * (comma-separated)
              </label>
              <input
                id="keyConceptsText"
                name="keyConceptsText"
                value={form.keyConceptsText}
                onChange={updateField}
                placeholder="HTTP, Sessions, XSS"
                required
              />
            </div>
          </div>

          <div className="admin-field" style={{ marginTop: 18 }}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
            />
          </div>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={updateField}
            />
            Publish this lab for students
          </label>
        </section>

        <section className="card card-padding">
          <div className="admin-section-heading">
            <div>
              <h2>Theory Sections</h2>
              <p className="muted">
                Each section needs a title and educational content.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addTheorySection}
            >
              + Add Section
            </button>
          </div>

          {form.theory.map((section, index) => (
            <article className="admin-theory-section" key={index}>
              <div className="admin-section-heading">
                <h3>Section {index + 1}</h3>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeTheorySection(index)}
                  disabled={form.theory.length === 1}
                >
                  Remove
                </button>
              </div>

              <div className="admin-field">
                <label htmlFor={`theory-title-${index}`}>
                  Section title *
                </label>
                <input
                  id={`theory-title-${index}`}
                  value={section.title}
                  onChange={(event) =>
                    updateTheory(index, "title", event.target.value)
                  }
                  minLength={2}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor={`theory-content-${index}`}>
                  Theory content *
                </label>
                <textarea
                  id={`theory-content-${index}`}
                  value={section.content}
                  onChange={(event) =>
                    updateTheory(index, "content", event.target.value)
                  }
                  minLength={10}
                  rows={5}
                  required
                />
              </div>
            </article>
          ))}
        </section>

        <div className="admin-form-actions">
          <Link
            to="/admin/labs"
            className="btn btn-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Lab"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminLabForm;
