export type Role = "admin" | "editor" | "viewer";

export type Permission = "post:create" | "post:update" | "post:delete" | "post:read";

const MATRIX: Record<Role, Permission[]> = {
  admin: ["post:create", "post:update", "post:delete", "post:read"],
  editor: ["post:update", "post:read"],
  viewer: ["post:read"],
};

export const ROLES: Role[] = ["admin", "editor", "viewer"];

export const ROLE_BLURB: Record<Role, string> = {
  admin: "Full control: create, edit and delete posts.",
  editor: "Can edit and update existing posts.",
  viewer: "Read-only access to all posts.",
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return MATRIX[role].includes(permission);
}
