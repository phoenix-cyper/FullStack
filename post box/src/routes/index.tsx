import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Palette, Send } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Post Box — Character Counter" },
      {
        name: "description",
        content:
          "Write a post with a live character counter, a 100 character limit, and four switchable color themes.",
      },
      { property: "og:title", content: "Post Box — Character Counter" },
      {
        property: "og:description",
        content:
          "Write a post with a live character counter, a 100 character limit, and four switchable color themes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const MAX_LENGTH = 100;
const THEME_KEY = "postbox-theme";

const THEMES = [
  { id: "midnight", label: "Midnight", swatch: "#5b5bd6" },
  { id: "ocean", label: "Ocean", swatch: "#31b5c8" },
  { id: "sunset", label: "Sunset", swatch: "#f97316" },
  { id: "forest", label: "Forest", swatch: "#3f8f5f" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function isValidTheme(value: string): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

function Index() {
  const [text, setText] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId>("midnight");

  // Restore the saved theme after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved && isValidTheme(saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const length = text.length;
  const isOverLimit = length > MAX_LENGTH;
  const isNearLimit = length >= MAX_LENGTH * 0.8 && !isOverLimit;
  const canPost = length > 0 && !isOverLimit;

  const handlePost = () => {
    if (!canPost) return;
    setPosted(text.trim());
    setText("");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-foreground">
      {/* Ambient animated background */}
      <div className="bg-glow" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="theme-card relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Post Box
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Share what's on your mind — up to {MAX_LENGTH} characters.
            </p>
          </div>

          {/* Theme switcher */}
          <div
            role="group"
            aria-label="Color theme"
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 p-1.5"
          >
            {THEMES.map(({ id, label, swatch }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                aria-label={`${label} theme`}
                aria-pressed={theme === id}
                title={label}
                className={`grid size-6 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  theme === id ? "ring-2 ring-ring ring-offset-2 ring-offset-card" : ""
                }`}
              >
                <span
                  className="grid size-4 place-items-center rounded-full text-white"
                  style={{ backgroundColor: swatch }}
                >
                  {theme === id && <Check className="size-3" strokeWidth={3} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="post-content" className="sr-only">
          Post content
        </label>
        <textarea
          id="post-content"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPosted(null);
          }}
          placeholder="Write your post here…"
          rows={4}
          maxLength={200}
          aria-invalid={isOverLimit}
          className="mt-5 w-full resize-none rounded-xl border border-input bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive"
        />

        <div className="mt-2 flex min-h-6 items-center justify-between gap-3">
          <p
            aria-live="polite"
            className={`text-sm font-medium ${isOverLimit ? "text-destructive" : "text-transparent"}`}
          >
            Limit exceeded
          </p>
          <span
            className={`text-sm tabular-nums ${
              isOverLimit
                ? "font-semibold text-destructive"
                : isNearLimit
                  ? "font-medium text-chart-4"
                  : "text-muted-foreground"
            }`}
          >
            {length} / {MAX_LENGTH}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p
            aria-live="polite"
            className={`text-sm text-muted-foreground transition-opacity ${posted ? "opacity-100" : "opacity-0"}`}
          >
            Posted!
          </p>
          <button
            type="button"
            onClick={handlePost}
            disabled={!canPost}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            <Send className="size-4" aria-hidden="true" />
            Post
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <Palette className="size-3.5" aria-hidden="true" />
          Pick a theme — your choice is remembered.
        </div>
      </div>
    </main>
  );
}
