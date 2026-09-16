import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
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
    return <p>Loading lab...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!lab) {
    return <p>Lab not found.</p>;
  }

  return (
    <div>
      <Link to="/labs">← Back to Labs</Link>

      <h1>{lab.title}</h1>

      <p>{lab.description}</p>

      <p>
        Difficulty: {lab.difficulty} | Estimated time:{" "}
        {lab.estimatedTime} minutes
      </p>

      <h2>Key Concepts</h2>

      <ul>
        {lab.keyConcepts.map((concept) => (
          <li key={concept}>{concept}</li>
        ))}
      </ul>

      <hr />

      {lab.theory.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}

      <hr />

      <Link to={`/labs/${lab._id}/quiz`}>
        Take Lab Quiz
      </Link>
    </div>
  );
}

export default LabDetail;