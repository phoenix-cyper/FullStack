import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Unauthorized() {
  const { role } = useAuth();
  return (
    <main className="shell center">
      <div className="panel">
        <h1>403 — Access denied</h1>
        <p className="muted small">
          Your role{role ? ` (${role})` : ""} does not include the permission required for
          that route.
        </p>
        <Link className="btn wide" to="/dashboard" style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
