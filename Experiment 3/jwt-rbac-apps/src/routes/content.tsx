import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { RoleNav } from "@/components/RoleNav";
import { RequireRole } from "@/components/RequireRole";
import { PostDialog } from "@/components/PostDialog";
import { Button } from "@/components/ui/button";
import { createPost, deletePost, updatePost, usePosts, type Post } from "@/lib/posts";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content — JWT + RBAC Playground" },
      {
        name: "description",
        content:
          "Shared post list where admins create and delete, editors update, and viewers read only.",
      },
      { property: "og:title", content: "Content — JWT + RBAC Playground" },
      {
        property: "og:description",
        content: "One shared post list, three roles, permission-gated actions.",
      },
    ],
  }),
  component: Content,
});

function Content() {
  const { ready, user, role } = useAuth();
  const navigate = useNavigate();
  const posts = usePosts();
  const [editing, setEditing] = useState<Post | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  if (!ready || !user) return null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <RoleNav />

      <header className="mt-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-serif text-5xl font-bold tracking-tight">
            <FileText className="size-9 text-primary" />
            Posts
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your role is <span className="font-mono">{role}</span>. Admin can create, edit and
            delete; editor can edit and update only; viewer is read-only.
          </p>
        </div>
        <RequireRole permission="post:create">
          <Button
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            New post
          </Button>
        </RequireRole>
      </header>

      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex items-start justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {post.status}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <RequireRole permission="post:update">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(post);
                    setOpen(true);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
              </RequireRole>
              <RequireRole permission="post:delete">
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </RequireRole>
            </div>
          </li>
        ))}
      </ul>

      <PostDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        post={editing}
        onSubmit={(values) => {
          if (editing) updatePost(editing.id, values);
          else createPost(values, role ?? "admin");
        }}
      />
    </main>
  );
}
