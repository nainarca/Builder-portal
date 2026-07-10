# Authorization Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-006_Authentication_Authorization_Architecture.md`](NG-006_Authentication_Authorization_Architecture.md)
**Covers:** Authorization Principles, Organization Context, Organization Switching, User Context, Permission Resolution, Builder Context, Super Admin Context, Public Visitor Context, Route Protection Strategy, Feature Authorization, Menu Authorization, API Authorization (Concept Only).

## 2. Authorization Principles

`PERMISSION_MATRIX.md` (A-008) is the single source of truth for every authorization decision this platform makes. This document defines **how** that matrix is evaluated at runtime — never redefines **what** it says. Permissions are resolved fresh at session bootstrap and are never assumed stale-safe across a role change within a session.

## 6. Organization Context

Gates whether RBAC can be evaluated at all — no resolved Organization Context means no permission set, means no protected route renders (main document §9's three-check Route Protection sequence starts here). Builder Portal's Organization Context is session-scoped, fixed for the session's lifetime (ADR-011); Super Admin's is not a single "my Organization" at all — see § Super Admin Context below.

## 11. Organization Switching

**Not supported anywhere in this platform today — for either role, and for two different reasons that should not be conflated:**

- **Builder Portal:** no switching exists because there is nothing to switch between — a Builder session is single-Organization by construction (ADR-011's own premise). There is no "switch Organization" UI, flow, or state to design.
- **Super Admin:** Super Admin does not "switch into" an Organization's context in the sense of becoming a member of it. Viewing Organization-scoped data happens either through Internal-classification cross-Organization views (Organization Management, User Management — always-available, read-mostly) or through **Support Access** (A-008 §7) — a temporary, audited *extension* of Super Admin's own permission set, never an assumption of the Organization's own identity or role. Calling Support Access "switching" would be a real conceptual error this document deliberately avoids.

## 12. User Context

Role and Organization-membership detail, resolved *after* Authentication Context and Organization Context — feeds directly into Permission Resolution (§13) and nothing else.

## 13. Permission Resolution

The runtime algorithm, stated once here rather than re-derived per consumer: given (Authentication Context + Organization Context + User Context), compute the applicable row(s) from `PERMISSION_MATRIX.md` → produce one resolved permission-set Signal (`RBAC_INTEGRATION.md`) → every route guard, menu-visibility check, and feature-load gate reads *from* this one resolved set. Nothing downstream re-derives permissions independently — that would be exactly the "duplicate state" NG-005's ownership rules forbid, applied to authorization specifically.

## 15. Builder Context

Identity + Organization Context (one Organization, fixed for the session) + Role (Owner/Admin/Member, `ROLE_CATALOG.md`) + the resolved permission set. No Support-Access-equivalent exists for any Builder role — that mechanism is exclusively a Super Admin capability.

## 16. Super Admin Context

Identity + Role (Super Admin, platform-wide) + a resolved permission set that defaults to Internal-classification access, **plus an optional, transient Support Access grant** (A-008 §7) that temporarily extends that permission set to include exactly one specific Organization's Organization-Confidential data — explicit, time-boxed, audited, and **never, under any circumstance, extending to Restricted-Financial data** (A-008's absolute rule, restated once more because it is the one rule in this entire architecture that must never develop an exception). This is the precise place Support Access's relationship to the identity model is finally stated: it is an *extension* of Super Admin Context, not a role switch, not impersonation, not a second identity.

## 17. Public Visitor Context

No Authentication Context, no Organization Context, no User Context, no permission set — the genuine zero-state, matching `ROLE_CATALOG.md`'s System Roles table exactly.

## 19. Route Protection Strategy

Every protected route resolves through the same three checks, in this order, conceptually (not as implementation): (1) Authentication Context valid, (2) Organization Context resolved (for Builder Portal/Super Admin routes), (3) the resolved RBAC permission set (§13) permits this specific route, per `PERMISSION_MATRIX.md`/`SCREEN_PERMISSIONS.md`. This restates NG-004 §10's Role Based Navigation with the full authentication lifecycle now behind it, and restates NG-000's central rule once more: this three-check sequence is UX. Supabase RLS is what actually enforces it (§22).

## 20. Feature Authorization

The same three-check pattern applies at the Feature-load boundary (NG-005's Feature-scoped state) — and a Feature's own data-fetching additionally re-checks via RLS independently, never trusting that "the route guard already checked" is sufficient. Defense in depth: route guard *and* RLS, never route-guard-only.

## 21. Menu Authorization

Menu items (A-005 §15 Permission Based Navigation) are shown or hidden using the **exact same resolved permission-set Signal** as route protection — never a second, independently-maintained menu-visibility check. This is the specific, concrete fix for a common real-world bug class: a hidden menu item whose underlying route is still reachable by direct URL because menu logic and route-guard logic quietly drifted apart. Here, they cannot drift, because they read the same Signal.

## 22. API Authorization (Concept Only)

Every Supabase call carries the session's JWT automatically via the Supabase client SDK; RLS evaluates that JWT server-side, entirely independent of whatever the Angular application currently believes its own permission set to be. Stated once more, plainly: Angular-side RBAC is UX. Supabase RLS is enforcement. This document does not design RLS policies — that is explicitly out of scope, per this document's own Quality Rules.
