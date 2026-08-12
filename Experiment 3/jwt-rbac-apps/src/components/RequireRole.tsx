import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import type { Permission } from "@/lib/rbac";

export function RequireRole({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useAuth();
  return <>{can(permission) ? children : fallback}</>;
}
