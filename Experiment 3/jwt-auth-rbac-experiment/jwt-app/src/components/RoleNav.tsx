import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

/** Navigation links render only for permissions the current role grants. */
export default function RoleNav() {
  const { role, logout, hasPermission } = useAuth();
  return (
    <nav className="nav">
      <div className="row">
        <NavLink to="/dashboard">Dashboard</NavLink>
        {hasPermission("content:view") && <NavLink to="/content">Content</NavLink>}
        {hasPermission("users:manage") && <NavLink to="/admin">Admin</NavLink>}
      </div>
      <div className="row">
        <span className="pill">{role}</span>
        <button className="btn ghost" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
