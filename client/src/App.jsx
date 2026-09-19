import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    
    <Route
        path="/labs"
        element={
          <ProtectedRoute>
            <Labs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/labs/:slug"
        element={
          <ProtectedRoute>
            <LabDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labs/:labId/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;