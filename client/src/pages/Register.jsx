import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


return (
  <main className="auth-page">
    <section className="auth-card">
      {/* Logo */}
      <div className="auth-logo">
        <span className="brand-mark">CX</span>

        <span>
          Cyber<span>XInfinity</span>
        </span>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1>Create Account</h1>

        <p>
          Join CyberXInfinity and start your
          cybersecurity learning journey.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            autoComplete="username"
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength="6"
            required
          />
        </div>

        {/* Register */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 4,
          }}
        >
          {loading
            ? "Creating account..."
            : "Create Account →"}
        </button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </div>
    </section>
  </main>
);


}

export default Register;