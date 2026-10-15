import { Navigate } from "react-router";
import Navbar from "./Navbar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <Navbar />

      {children}
    </div>
  );
}

export default ProtectedRoute;