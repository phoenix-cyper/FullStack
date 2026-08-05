// --- Minimal HS256 JWT implementation (educational / client-side mock) ---
// A JWT = base64url(header) . base64url(payload) . base64url(HMAC-SHA256 signature)

const SECRET = "experiment-demo-secret-key";

export type JwtPayload = {
  sub: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
};

const enc = new TextEncoder();

function b64url(bytes: Uint8Array | string): string {
  const str =
    typeof bytes === "string"
      ? bytes
      : String.fromCharCode(...Array.from(bytes));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): string {
  const pad = input.replace(/-/g, "+").replace(/_/g, "/");
  return atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

/** Simulates the server issuing a signed token after validating credentials. */
export async function signToken(
  payload: Omit<JwtPayload, "iat" | "exp">,
  ttlSeconds = 60 * 15,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(body))}`;
  return `${unsigned}.${await hmac(unsigned)}`;
}

/** Decodes without verifying — never trust this for access decisions. */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(b64urlDecode(parts[1]!)) as JwtPayload;
  } catch {
    return null;
  }
}

export function decodeHeader(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(b64urlDecode(token.split(".")[0]!));
  } catch {
    return null;
  }
}

/** Verifies signature + expiry, as a server would on every request. */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const expected = await hmac(`${parts[0]}.${parts[1]}`);
  if (expected !== parts[2]) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp * 1000 < Date.now()) return null;
  return payload;
}