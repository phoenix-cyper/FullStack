import type { Role } from "./rbac";

export type DemoAccount = {
  username: string;
  password: string;
  role: Role;
  name: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { username: "admin", password: "admin123", role: "admin", name: "Ada Admin" },
  { username: "editor", password: "editor123", role: "editor", name: "Eli Editor" },
  { username: "viewer", password: "viewer123", role: "viewer", name: "Vic Viewer" },
];

export function findAccount(username: string, password: string): DemoAccount | undefined {
  const u = username.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.username === u && a.password === password);
}
