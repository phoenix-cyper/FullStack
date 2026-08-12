import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { decodeUnverified } from "@/lib/jwt";

export function TokenInspector() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  if (!token) return null;
  const decoded = decodeUnverified(token);

  return (
    <section className="mt-10 rounded-xl border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium"
      >
        Token inspector
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t px-5 py-4">
          <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
            {JSON.stringify(decoded, null, 2)}
          </pre>
          <p className="break-all font-mono text-xs text-muted-foreground">{token}</p>
        </div>
      )}
    </section>
  );
}
