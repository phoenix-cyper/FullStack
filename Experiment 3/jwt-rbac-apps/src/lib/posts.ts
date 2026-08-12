import { useSyncExternalStore } from "react";

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  updatedAt: number;
  authorRole: string;
};

// One shared key for ALL roles and sessions. Never namespaced per user and
// never cleared on logout — that is what made new posts "disappear".
const KEY = "rbac.posts.v1";

const SEED: Post[] = [
  {
    id: "seed-1",
    title: "Stateless sessions with JWT",
    excerpt: "How signed tokens replace server-side sessions.",
    status: "published",
    updatedAt: Date.now() - 86_400_000 * 3,
    authorRole: "admin",
  },
  {
    id: "seed-2",
    title: "Designing role hierarchies",
    excerpt: "Mapping roles to fine-grained permissions.",
    status: "draft",
    updatedAt: Date.now() - 86_400_000 * 2,
    authorRole: "admin",
  },
  {
    id: "seed-3",
    title: "Protecting routes in React",
    excerpt: "Guarding UI with permission checks instead of role strings.",
    status: "published",
    updatedAt: Date.now() - 86_400_000,
    authorRole: "editor",
  },
];

let cache: Post[] = SEED;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): Post[] {
  if (typeof window === "undefined") return SEED;
  const raw = window.localStorage.getItem(KEY);
  if (raw === null) {
    window.localStorage.setItem(KEY, JSON.stringify(SEED));
    cacheRaw = JSON.stringify(SEED);
    cache = SEED;
    return cache;
  }
  if (raw !== cacheRaw) {
    try {
      cache = JSON.parse(raw) as Post[];
    } catch {
      cache = SEED;
    }
    cacheRaw = raw;
  }
  return cache;
}

function write(next: Post[]) {
  cache = next;
  cacheRaw = JSON.stringify(next);
  window.localStorage.setItem(KEY, cacheRaw);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePosts(): Post[] {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => SEED,
  );
}

export function createPost(input: Pick<Post, "title" | "excerpt" | "status">, authorRole: string) {
  const post: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...input,
    updatedAt: Date.now(),
    authorRole,
  };
  write([post, ...read()]);
  return post;
}

export function updatePost(id: string, patch: Partial<Pick<Post, "title" | "excerpt" | "status">>) {
  write(read().map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)));
}

export function deletePost(id: string) {
  write(read().filter((p) => p.id !== id));
}
