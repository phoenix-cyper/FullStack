// Tiny demo JWT (HS256-shaped, signed with a toy HMAC). Educational only.
import type { Role } from "./rbac";

export type JwtPayload = {
  sub: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
};

const SECRET = "demo-secret";

function b64urlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toySignature(data: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const material = `${data}.${SECRET}`;
  for (let i = 0; i < material.length; i++) {
    h1 = (h1 ^ material.charCodeAt(i)) >>> 0;
    h1 = (h1 * 16777619) >>> 0;
    h2 = ((h2 << 5) - h2 + material.charCodeAt(i)) >>> 0;
  }
  return b64urlEncode(`${h1.toString(16)}${h2.toString(16)}`);
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">, ttlSeconds = 3600): string {
  const iat = Math.floor(Date.now() / 1000);
  const body: JwtPayload = { ...payload, iat, exp: iat + ttlSeconds };
  const header = b64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const claims = b64urlEncode(JSON.stringify(body));
  return `${header}.${claims}.${toySignature(`${header}.${claims}`)}`;
}

export function verifyToken(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, claims, signature] = parts;
  if (toySignature(`${header}.${claims}`) !== signature) return null;
  try {
    const payload = JSON.parse(b64urlDecode(claims!)) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function decodeUnverified(token: string): { header: unknown; payload: unknown } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return {
      header: JSON.parse(b64urlDecode(parts[0]!)),
      payload: JSON.parse(b64urlDecode(parts[1]!)),
    };
  } catch {
    return null;
  }
}
