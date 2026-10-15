import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getLabs } from "../services/labService";

function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const data = await getLabs();
        setLabs(data.labs);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load labs."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLabs();
  }, []);

  if (loading) {
    return (
      <main className="main-content container">
        <p className="muted">
          Loading labs...
        </p>
      </main>
    );
  }

  return (
    <main className="main-content container">
      <section className="page-header">
        <p className="badge">
          Learning Paths
        </p>

        <h1>Cybersecurity Labs</h1>

        <p>
          Build your cybersecurity foundation through
          four structured learning labs.
        </p>
      </section>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="grid grid-2">
        {labs.map((lab) => (
          <article
            key={lab._id}
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

              <span className="badge badge-success">
                {lab.difficulty}
              </span>
            </div>

            <h2>{lab.title}</h2>

            <p className="muted">
              {lab.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                margin: "16px 0",
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

            <p className="muted">
              ⏱ {lab.estimatedTime} minutes
            </p>

            <Link
              to={`/labs/${lab.slug}`}
              className="btn btn-primary"
            >
              Explore Lab →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Labs;