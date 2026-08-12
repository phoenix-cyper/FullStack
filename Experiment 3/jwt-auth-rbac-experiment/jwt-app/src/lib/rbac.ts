export const PERMISSIONS = [
  "content:view",
  "content:create",
  "content:edit",
  "content:delete",
  "users:manage",
  "settings:manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS = {
  admin: [
    "content:view",
    "content:create",
    "content:edit",
    "content:delete",
    "users:manage",
    "settings:manage",
  ],

  editor: [
    "content:view",
    "content:edit",
  ],

  viewer: [
    "content:view",
  ],
};