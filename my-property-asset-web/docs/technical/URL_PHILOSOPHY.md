# URL Philosophy — MyPropertyAsset Web Platform

**Companion to:** [`NG-004_Angular_Routing_Architecture.md`](NG-004_Angular_Routing_Architecture.md)
**Covers:** Organization Context Routing, White-label Route Strategy, Route Naming Standards, URL Philosophy, Deep Linking Strategy, 404 Strategy, Unauthorized Route Strategy.

## 16. Organization Context Routing — a real, hard-to-reverse decision (ADR-011)

**Builder Portal URLs never carry an Organization ID.** `/projects`, not `/organizations/:orgId/projects`. Organization scope is resolved entirely from the authenticated session's Organization Context (NG-001 §16), never from a URL segment — because a Builder Portal user belongs to exactly one Organization for the whole session (no multi-Organization switching UI exists anywhere in A-001 through A-009), so a URL-carried Organization ID would add a client-controllable value with no legitimate use *and* a real temptation to trust it for scoping instead of the session (a class of bug this decision eliminates by construction, not just by discipline).

**Super Admin URLs do carry an Organization/Builder ID** (`/builders/:builderId`, `/organizations/:organizationId`) — because Super Admin genuinely operates across many Organizations in one session, and the ID identifies *which one is currently being viewed*, not "which one the session is scoped to."

This asymmetry is deliberate and is recorded as **ADR-011 — Organization Context Routing: Session-Scoped for Builder Portal, URL-Identified for Super Admin.**

## 17. White-label Route Strategy

**No route, path segment, subdomain, or URL pattern encodes which Organization's branding is active.** White-label theming (NG-001 §13, NG-002/NG-003's `theme-tokens`/`theme-runtime`) is resolved from Organization Context during Shell bootstrap, applied to whatever route the session happens to be on — the same `/dashboard` URL renders with a different Organization's branding depending purely on who's logged in, never on what the URL says. A slug-based or subdomain-based tenant URL scheme (`acme.platform.com`, `platform.com/acme/...`) was considered and rejected for the reason given in §16: Builder Portal sessions are already single-Organization, so a URL-carried tenant identifier would be redundant with session state, not a source of truth. **Deferred, not decided**: if custom domains per Organization ever become an actual white-label requirement (no prior document has asked for this), that would be a DNS/hosting concern layered *on top of* this routing architecture, not a replacement for it — flagged as future expansion, not designed here.

## 18. Route Naming Standards

Kebab-case path segments (NG-000 `CODING_STANDARDS.md` §5, extended to URLs); resource-oriented naming (`/projects/:projectId/units/:unitId`, not `/getUnit?project=X&unit=Y`); no verb segments for standard CRUD navigation (`/projects`, not `/view-projects`) — verbs are reserved for genuine actions that aren't simple navigation (e.g., a future `/projects/:id/archive` action route, not designed here, would be a legitimate exception to this rule, not a violation of it).

## 19. URL Philosophy

URLs are addresses for *screens*, not for *permissions* — a URL never implies what its visitor is allowed to do, only where they're trying to go; the actual authorization decision is always made by RBAC (§15 of the main document) and enforced by RLS (NG-000 §14), regardless of how the URL was reached. This is the routing-level restatement of NG-000's central security principle: a route guard (and by extension, a "nice" URL) is UX, never the security boundary itself.

## 22. Deep Linking Strategy

| Deep link type | Behavior |
|---|---|
| Public Website (any route) | Always resolves, no precondition (NG-002 `WORKSPACE_GUIDE.md`-adjacent, restated from A-005 §Deep Linking Considerations) |
| Super Admin / Builder Portal (authenticated route) | Resolves after session validation; an unauthenticated deep link redirects to `/login` first, then continues to the originally-requested route post-authentication — never silently drops the original destination |
| Builder Portal route referencing another Organization's data | Fails closed at the RLS layer regardless of what the URL claims (§ Organization Context Routing) — the route itself does not and cannot validate this, only the backend can |
| Invitation link (Builder → Owner) | Terminates in the Owner Mobile App, outside this document's scope (`NAVIGATION_ARCHITECTURE.md` § Owner App Integration) |

## 23. 404 Strategy

Every application has its own 404 (not-found) route, scoped to that application only — a Builder Portal 404 never suggests a Super Admin URL, since a Builder Portal user should never be made aware Super Admin routes exist at all (a small but real information-boundary consideration, consistent with the "route guards are UX but the application boundary is the real isolation" principle, ADR-009).

## 24. Unauthorized Route Strategy

A route that exists but the current session lacks permission for (per `PERMISSION_MATRIX.md`) resolves to an explicit "not authorized" state, distinct from 404 — the route exists, the resource doesn't, or access is denied, are three different facts and this platform's routing surfaces them differently rather than collapsing every failure into a generic error, consistent with NG-000 §11's rule that Organization-isolation violations should be logged and surfaced clearly, not hidden behind a generic response.
