import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { Permission, Role } from "../lib/rbac";

type Props = { roles?: Role[]; permission?: Permission };

/** Route guard: authentication first, then role / permission authorization. */
export default function ProtectedRoute({ roles, permission }: Props) {
  const { ready, isAuthenticated, hasRole, hasPermission } = useAuth();

  if (!ready) return <main className="shell center muted">Verifying token…</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !hasRole(roles)) return <Navigate to="/unauthorized" replace />;
  if (permission && !hasPermission(permission)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
