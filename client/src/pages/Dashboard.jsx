import {
  Link,
  useNavigate,
} from "react-router";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>CyberXInfinity Dashboard</h1>

      <h2>
        Welcome, {user?.name} 👋
      </h2>

      <section>
        <h3>⭐ Points</h3>
        <p>{user?.points || 0}</p>
      </section>

      <section>
        <h3>📚 Labs Completed</h3>
        <p>
          {user?.completedLabs || 0} / 4
        </p>
      </section>

      <div>
        <Link to="/labs">
          Explore Labs
        </Link>
      </div>

      <div>
        <Link to="/leaderboard">
          🏆 Leaderboard
        </Link>
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;