import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useAuth, type StorageMode } from "@/lib/auth";
import { DEMO_ACCOUNTS } from "@/lib/accounts";
import { ROLE_BLURB } from "@/lib/rbac";
import { RoleNav } from "@/components/RoleNav";
import { TokenInspector } from "@/components/TokenInspector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePosts } from "@/lib/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JWT + RBAC Playground — Sign in" },
      {
        name: "description",
        content:
          "Sign in as admin, editor or viewer to explore JWT claims and role-based permissions on a shared content set.",
      },
      { property: "og:title", content: "JWT + RBAC Playground" },
      {
        property: "og:description",
        content: "Explore JWT claims and role-based access control across admin, editor and viewer.",
      },
    ],
  }),
  component: Index,
});

function SignIn() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<StorageMode>("localStorage");
  const [error, setError] = useState<string | null>(null);

  const modes: StorageMode[] = ["localStorage", "sessionStorage"];

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
          <KeyRound className="size-7" />
        </span>
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground">Mock credential validation</p>
        </div>
      </div>

      <form
        className="mt-10 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          const res = login(username, password, mode);
          setError(res.ok ? null : (res.error ?? "Login failed."));
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="username" className="text-base font-semibold">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            autoComplete="username"
            placeholder="admin"
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-base font-semibold">Token storage</span>
          <div className="grid grid-cols-2 gap-3">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`h-12 rounded-md border text-sm font-semibold transition-colors ${
                  mode === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:border-primary"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <Button type="submit" className="h-12 w-full text-base">
          Login
        </Button>
      </form>

      <div className="mt-8 rounded-lg border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Demo accounts
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.username} className="flex items-center justify-between gap-4">
              <span className="font-mono text-primary">
                {a.username} / {a.password}
              </span>
              <span className="text-muted-foreground">{a.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Index() {
  const { ready, user } = useAuth();
  const navigate = useNavigate();
  const posts = usePosts();

  if (!ready) return null;
  if (!user) return <SignIn />;

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <RoleNav />
      <h1 className="mt-10 font-serif text-5xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as <span className="font-mono">{user.name}</span> with role{" "}
        <span className="font-mono">{user.role}</span>. {ROLE_BLURB[user.role]}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Posts in shared store</p>
          <p className="mt-1 font-serif text-4xl font-bold">{posts.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-1 font-serif text-4xl font-bold">
            {posts.filter((p) => p.status === "published").length}
          </p>
        </div>
      </div>

      <Button className="mt-6" onClick={() => navigate({ to: "/content" })}>
        Go to content
      </Button>

      <TokenInspector />
    </main>
  );
}
