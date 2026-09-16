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
    return <p>Loading labs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Cybersecurity Labs</h1>

      <p>
        Learn cybersecurity concepts and test your knowledge
        through quizzes.
      </p>

      <div>
        {labs.map((lab) => (
          <article key={lab._id}>
            <h2>
              Lab {lab.order}: {lab.title}
            </h2>

            <p>{lab.description}</p>

            <p>Difficulty: {lab.difficulty}</p>

            <p>Estimated time: {lab.estimatedTime} minutes</p>

            <div>
              {lab.keyConcepts.map((concept) => (
                <span key={concept}>
                  {concept}{" "}
                </span>
              ))}
            </div>

            <Link to={`/labs/${lab.slug}`}>
              Start Lab
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Labs;