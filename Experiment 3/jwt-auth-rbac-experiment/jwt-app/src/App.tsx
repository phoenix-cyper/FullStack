import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./lib/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Content from "./pages/Content";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  const { ready, isAuthenticated } = useAuth();
  if (!ready) return <main className="shell center muted">Verifying token…</main>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authenticated-only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* Permission-gated */}
        <Route element={<ProtectedRoute permission="content:view" />}>
          <Route path="/content" element={<Content />} />
        </Route>
        {/* Role-gated */}
        <Route element={<ProtectedRoute roles={["admin"]} permission="users:manage" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
