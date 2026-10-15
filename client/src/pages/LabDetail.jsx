import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router";

import { getLabBySlug } from "../services/labService";

function LabDetail() {
  const { slug } = useParams();

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLab = async () => {
      try {
        const data = await getLabBySlug(slug);
        setLab(data.lab);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load lab."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLab();
  }, [slug]);

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">
          Loading lab...
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

  if (!lab) {
    return null;
  }

  return (
    <main className="main-content container">
      <Link to="/labs" className="muted">
        ← Back to Labs
      </Link>

      <section className="page-header"
        style={{ marginTop: 20 }}
      >
        <span className="badge">
          Lab {lab.order}
        </span>

        <h1>{lab.title}</h1>

        <p>{lab.description}</p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >
          <span className="badge">
            {lab.difficulty}
          </span>

          <span className="badge">
            ⏱ {lab.estimatedTime} min
          </span>
        </div>
      </section>

      <section className="card card-padding">
        <h2>Key Concepts</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {lab.keyConcepts.map(
            (concept) => (
              <span
                key={concept}
                className="badge"
              >
                {concept}
              </span>
            )
          )}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        {lab.theory.map(
          (section, index) => (
            <article
              key={section.title}
              className="card card-padding"
              style={{
                marginBottom: 18,
              }}
            >
              <span className="badge">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <h2>{section.title}</h2>

              <p
                style={{
                  lineHeight: 1.8,
                  color: "var(--muted)",
                }}
              >
                {section.content}
              </p>
            </article>
          )
        )}
      </section>

      <section
        className="card card-padding"
        style={{
          marginTop: 28,
          textAlign: "center",
        }}
      >
        <h2>Ready to test your knowledge?</h2>

        <p className="muted">
          Complete the quiz to evaluate your
          understanding and earn points.
        </p>

        <Link
          to={`/labs/${lab._id}/quiz`}
          className="btn btn-primary"
        >
          Take Lab Quiz →
        </Link>
      </section>
    </main>
  );
}

export default LabDetail;