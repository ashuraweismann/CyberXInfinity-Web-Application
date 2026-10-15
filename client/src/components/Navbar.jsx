import {
  NavLink,
  useNavigate,
} from "react-router";

function Navbar() {
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
    <header className="navbar">
      <div className="navbar-inner container">
        <NavLink
          to="/dashboard"
          className="navbar-brand"
        >
          <span className="brand-mark">
            CX
          </span>

          <span>
            Cyber<span> XInfinity</span>
          </span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink
            to="/dashboard"
            className="nav-link"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/labs"
            className="nav-link"
          >
            Labs
          </NavLink>

          <NavLink
            to="/leaderboard"
            className="nav-link"
          >
            Leaderboard
          </NavLink>
        </nav>

        <div className="navbar-user">
          <span className="navbar-username">
            {user?.username}
          </span>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;