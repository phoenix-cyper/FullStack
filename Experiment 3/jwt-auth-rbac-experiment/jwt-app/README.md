# JWT Authentication + Role-Based Access Control (RBAC)

React + Vite + TypeScript experiment combining:

**Part 1 — Authentication (JWT)**
- Login form with mock credential validation
- HS256 JWT signed in the browser (Web Crypto API)
- Token stored in localStorage / sessionStorage
- Token decoded to extract claims, auto sign-out at expiry

**Part 2 — Authorization (RBAC)**
- Roles: `admin`, `editor`, `viewer` (role claim lives inside the JWT)
- Permission map in `src/lib/rbac.ts`
- Protected routes with React Router (`src/components/ProtectedRoute.tsx`)
- Conditional UI: nav links and Edit buttons render per permission
- Unauthorized users are redirected to `/unauthorized`

## Roles and permissions

| Role   | Permissions                                                     |
|--------|-----------------------------------------------------------------|
| admin  | content:view, content:edit, users:manage, settings:manage         |
| editor | content:view, content:edit                                        |
| viewer | content:view                                                      |

## Routes

| Route           | Protection                                |
|-----------------|-------------------------------------------|
| `/login`        | public                                    |
| `/dashboard`    | authenticated                             |
| `/content`      | permission `content:view` (edit UI needs `content:edit`) |
| `/admin`        | role `admin` + permission `users:manage`  |
| `/unauthorized` | shown on denied access                    |

## Demo accounts

| Username | Password   | Role   |
|----------|------------|--------|
| admin    | admin123   | admin  |
| editor   | editor123  | editor |
| viewer   | viewer123  | viewer |

## Run it in VS Code

1. Unzip and open the `jwt-app` folder in VS Code.
2. `npm install`
3. `npm run dev`
4. Open the printed URL (http://localhost:5173) and sign in.

Try logging in as `viewer` and visiting `/admin` — you get redirected to `/unauthorized`.

## Security notes

This is an educational demo: the token is signed in the browser, so the secret is
public. In production, sign and verify JWTs on the server, keep the secret server-side,
prefer httpOnly cookies over localStorage, and enforce every role check on the server —
client-side RBAC is only for UX.
