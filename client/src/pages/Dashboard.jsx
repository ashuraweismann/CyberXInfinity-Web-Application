import { Link, useNavigate } from "react-router";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>CyberXInfinity Dashboard</h1>

      <h2>Welcome, {user?.name} 👋</h2>

      <p>Points: {user?.points || 0}</p>

      <p>
        Completed Labs: {user?.completedLabs || 0}
      </p>

      <Link to="/labs">
        Explore Labs
      </Link>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;