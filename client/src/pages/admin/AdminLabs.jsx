
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getAdminLabs,
  deleteAdminLab,
} from "../../services/adminLabService";

function AdminLabs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState("asc");

  const loadLabs = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminLabs({
        q,
        difficulty,
        status,
        sortBy,
        sortOrder,
      });

      setLabs(data.labs);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load labs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, [q, difficulty, status, sortBy, sortOrder]);

  const handleDelete = async (lab) => {
    const confirmed = window.confirm(
      `Delete or archive "${lab.title}"? Labs with student history will be archived to preserve quiz records.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await deleteAdminLab(lab._id);

      setNotice(response.message);

      await loadLabs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete or archive the lab."
      );
    }
  };

  return (
    <main className="main-content container">
      <header className="page-header">
        <p className="badge">Administration</p>
        <h1>Lab Management</h1>
        <p>
          Create, review, update and manage cybersecurity labs.
        </p>
      </header>

      <div className="admin-toolbar">
        <Link
          to="/admin/labs/new"
          className="btn btn-primary"
        >
          + Create Lab
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {notice && (
        <div className="admin-notice">
          {notice}
        </div>
      )}

      <section className="card card-padding admin-filters">
        <div className="admin-field">
          <label htmlFor="lab-search">Search labs</label>
          <input
            id="lab-search"
            type="search"
            placeholder="Search title, description or concept..."
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="difficulty-filter">Difficulty</label>
          <select
            id="difficulty-filter"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value)
            }
          >
            <option value="">All difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All labs</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="sort-filter">Sort by</label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="order">Display order</option>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
            <option value="estimatedTime">Estimated time</option>
            <option value="createdAt">Created date</option>
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="sort-direction">Direction</label>
          <select
            id="sort-direction"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </section>

      <section className="card admin-table-wrapper">
        {loading ? (
          <p className="card-padding muted">Loading labs...</p>
        ) : labs.length === 0 ? (
          <p className="card-padding muted">
            No labs match your filters.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Lab</th>
                <th>Difficulty</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {labs.map((lab) => (
                <tr key={lab._id}>
                  <td>{lab.order}</td>

                  <td>
                    <strong>{lab.title}</strong>
                    <p className="muted admin-slug">
                      {lab.slug}
                    </p>
                  </td>

                  <td>{lab.difficulty}</td>

                  <td>{lab.estimatedTime} min</td>

                  <td>
                    <span
                      className={
                        lab.isPublished
                          ? "badge badge-success"
                          : "badge badge-warning"
                      }
                    >
                      {lab.isPublished ? "Published" : "Archived"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/labs/${lab._id}/edit`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(lab)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="muted admin-count">
        Showing {labs.length} lab(s). The API returns at most 100 per request.
      </p>
    </main>
  );
}

export default AdminLabs;
