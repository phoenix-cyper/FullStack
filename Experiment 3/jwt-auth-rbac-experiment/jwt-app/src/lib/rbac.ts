// --- Role-Based Access Control (RBAC) definitions ---

export const ROLES = ["admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "content:view",
  "content:edit",
  "users:manage",
  "settings:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

/** Each role maps to the set of permissions it grants. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["content:view", "content:edit", "users:manage", "settings:manage"],
  editor: ["content:view", "content:edit"],
  viewer: ["content:view"],
};

export function permissionsFor(role: string): Permission[] {
  return ROLE_PERMISSIONS[role as Role] ?? [];
}

export function roleHasPermission(role: string, permission: Permission): boolean {
  return permissionsFor(role).includes(permission);
}
