# Navigation Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-004_Angular_Routing_Architecture.md`](NG-004_Angular_Routing_Architecture.md)
**Purpose:** Translates A-005's business-level Navigation Flow into route-tree shape — the technical *consequence* of A-005, not a restatement of it. For business rationale (why a screen exists, what it's for), see A-005 directly; this document only adds route structure.

## 3. Public Website Routes

| Route | Screen (A-004) |
|---|---|
| `/` | PW-01 Home |
| `/features` | PW-02 |
| `/pricing` | PW-03 |
| `/about` | PW-04 |
| `/faq` | PW-05 |
| `/contact` | PW-06 |
| `/demo-request` | PW-07 |
| `/register` | PW-08 Builder Registration |
| `/login` | PW-09 Login Gateway — resolves to a cross-application redirect (`ROUTING_STRATEGY.md` §1), never an internal route render |

## 5. Super Admin Route Zone

| Route | Screen (A-004) |
|---|---|
| `/login` | SA-01 |
| `/dashboard` | SA-02 |
| `/builders` | SA-03 |
| `/builders/:builderId` | SA-04 |
| `/builders/:builderId/white-label` | SA-06 |
| `/builders/:builderId/subscription` | SA-07 |
| `/organizations` | SA-05 |
| `/users` | SA-08 *(no backing A-003A story — inherited gap)* |
| `/monitoring` | SA-09 |
| `/audit` | SA-10 *(no backing A-003A story — inherited gap)* |
| `/settings` | SA-11 |

## 6. Builder Portal Route Zone

| Route | Screen (A-004) / Library (NG-003) |
|---|---|
| `/login` | BA-01 |
| `/dashboard` | BA-02 / `builder-portal-dashboard` |
| `/projects` | BA-03 / `builder-portal-projects` |
| `/projects/:projectId` | BA-04 |
| `/projects/:projectId/units` | BA-05 / `builder-portal-units` |
| `/projects/:projectId/units/:unitId` | BA-06 |
| `/projects/:projectId/units/:unitId/assign` | BA-07 |
| `/projects/:projectId/units/:unitId/documents` | BA-08 / `builder-portal-documents` |
| `/invitations` | BA-09 / `builder-portal-invitations` |
| `/documents` | BA-10 (library view, cross-project) |
| `/reports` | BA-11 / `builder-portal-reports` |
| `/notifications` | BA-12 |
| `/settings` | BA-13 *(no backing A-003A story — inherited gap)* / `builder-portal-settings` |

**No route exists for "Owners" or "Profile"** (A-005 NAV-BA-04, NAV-BA-10) — consistent with every prior document in this series, no screen exists to route to, so none is invented here either.

## 7. Shared Platform Routes

`/profile`, `/preferences`, `/notifications`, `/help` — requested by this prompt as "Shared Platform" routes. **"Shared" here means shared *implementation* (the same feature library, per NG-003's Utility/Core conventions where applicable), never a shared *URL*** — Super Admin and Builder Portal each mount their own `/profile`, `/preferences`, `/help` at the same relative path, because two separately-deployed applications cannot literally share a route.

- `/notifications` already exists per-app (A-007 ID-11, Communication feature) — not new.
- `/profile` is the same gap A-005 already flagged (NAV-BA-10) — no screen exists yet; reserving the route path is harmless, but nothing renders there today.
- `/preferences` and `/help` are **new, unbacked by any prior document** (not A-001–A-009, not NG-000–NG-003) — reserved route paths only, consistent with this series' standing treatment of unbacked requests (Partner Portal, Internationalization).

## 8. Future Tenant Routes

Reserved under a future `tenant-platform` application (NG-002), not designed — no route is specified here, consistent with A-003 §9/A-007 ID-15's "integration points only, no workflow designed" instruction, now extended to "no route designed."

## Owner App Integration (reference only)

No routes are designed for the Owner Mobile App — it is Flutter, not Angular, and has its own navigation entirely outside this document's scope (A-004 §8, A-005 §7). This document's only relevant fact: the invitation deep link (`ROUTING_STRATEGY.md` §1's cross-application navigation) terminates in a mobile deep link, not a web route, once it leaves the Builder Portal application.

## 20. Breadcrumb Strategy

Unchanged from A-005 §11 — breadcrumbs render only where a route is nested three or more levels deep. In route terms, that means exactly `/projects/:projectId/units/:unitId/**` (four segments) — no other route zone in this platform reaches that depth, so no other route zone gets a breadcrumb.

## 21. Navigation Hierarchy

See A-005's `NAVIGATION_HIERARCHY.md` for the business-level tree — this document's route tables above are that same tree expressed as URL structure, not a second, independently-derived hierarchy.
