import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<main className="auth-page">
  <section className="auth-card">
    <div className="auth-logo">
      <span className="brand-mark">CX</span>

      <span>
        Cyber<span>XInfinity</span>
      </span>
    </div>

    <div className="page-header">
      <h1>Welcome Back</h1>
      <p>
        Sign in to continue your cybersecurity
        learning journey.
      </p>
    </div>

    {error && (
      <div
        className="error"
        style={{ marginBottom: 16 }}
      >
        {error}
      </div>
    )}


      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
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
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Login Button */}
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
            ? "Logging in..."
            : "Login →"}
        </button>
      </form>

    <div className="auth-footer">
      Don't have an account?{" "}
      <Link to="/register">
        Create one
      </Link>
    </div>
  </section>
</main>

  );
}

export default Login;