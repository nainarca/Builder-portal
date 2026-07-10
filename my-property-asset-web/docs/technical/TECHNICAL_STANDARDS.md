# Technical Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-000_Web_Platform_Technical_Governance.md`](NG-000_Web_Platform_Technical_Governance.md)
**Covers:** Architecture, Design, Layering, Dependency, Error Handling, Logging, Monitoring, Security, Authentication, Authorization, White-label, Multi-Tenant, Performance, Scalability, Configuration, Environment, and Build standards.

## 1. Technical Architecture Principles

- Layered architecture, one-directional dependency (see §3).
- Backend integration exclusively through Supabase's client SDK and RPC functions — never a hand-rolled API layer duplicating what Supabase already provides.
- Every architectural boundary already established in the business documents (Organization isolation, Restricted-Financial's no-exception rule, Builder Portal's non-ERP scope) is a **hard technical constraint**, not a UI convention — enforced server-side (RLS) first, client-side second.

## 2. Enterprise Design Principles

SOLID; DRY without premature abstraction (three similar lines beat a wrong abstraction); YAGNI; composition over inheritance (Angular standalone components/services, subject to formal confirmation in NG-001/ADR-001); convention over configuration.

## 3. Layering Principles

```
Presentation (components — UI + user interaction only)
        ↓ depends on
Application / State (services, stores, facades — orchestration)
        ↓ depends on
Domain (business rules, validators — mirrors A-002/A-003A business rules)
        ↓ depends on
Data Access (Supabase client wrappers — the only layer touching the network)
```
Strictly one-directional. Data Access never imports from Presentation. A component never calls Supabase directly — always through a service in the Application layer.

## 4. Dependency Rules

- No circular dependencies between feature modules.
- Shared/common libraries have zero dependency on any feature module.
- Feature modules never import each other directly — they communicate via shared state/services or routing, mirroring the Organization-isolation principle applied to code structure: a Builder-feature module has no business importing anything from an Owner-feature module, structurally, not just by convention.

## 11. Error Handling Principles

- Centralized error handling (global error handler + HTTP interceptor) — no local, inconsistent `try/catch` scattered per component.
- User-facing errors are distinct from technical/logged errors — never surface a raw Supabase/Postgres error message to an end user.
- **Organization-isolation violations and Restricted-Financial access attempts must fail loudly and generate a security-relevant log entry** — never a silent, generic 403 indistinguishable from an ordinary permission miss. This directly operationalizes A-008's insistence that Restricted-Financial access has no exception, ever: an *attempt* is itself worth knowing about.

## 12. Logging Principles

- Structured logging (not free-text string concatenation).
- **No Restricted-Financial content (A-008 ID-13) ever appears in a log, under any log level, in any environment** — the same absolute rule A-008 applies to access now applies to logging.
- Correlation IDs for tracing a request across layers.
- Log levels used consistently: debug (dev only), info (normal operation), warn (recoverable anomaly), error (failure requiring attention).

## 13. Monitoring Principles

- Application health monitoring is a technical/APM concern — explicitly out of scope for the business-level Platform Monitoring already specified (A-004 SA-09, A-007 ID-06) — the two are complementary, not duplicates.
- Support Access invocations (A-008 §7) are monitored as security-relevant events specifically — every invocation must be independently visible to monitoring, not just recoverable after the fact from the audit log.

## 14. Security Principles

- Defense in depth; never trust the client.
- **Organization isolation and every RBAC rule in `PERMISSION_MATRIX.md` are enforced via Supabase Row Level Security — Angular route guards are a UX convenience layer, never the actual security boundary.** A route guard hiding a screen is not equivalent to data being inaccessible; only RLS provides the latter.
- The one absolute rule carried from A-008 restated as a technical principle: no code path, caching layer, or client-side state store may ever hold Restricted-Financial data for any actor other than its owning Property Owner — this must be true even transiently (no debug logging, no error payloads, no analytics events).

## 15. Authentication Principles

Supabase Auth exclusively — no parallel authentication mechanism is introduced for the web platform. Session handling is consistent across the Angular app (a single source of truth for "who is logged in," not per-feature-module session state).

## 16. Authorization Principles

`PERMISSION_MATRIX.md` (A-008) is the single source of truth for authorization decisions. Technical implementation (route guards, component-level conditionals, RLS policies) must be *derived from* that matrix — never a parallel, independently-invented authorization scheme that could drift from it. Support Access (A-008 §7) requires its own explicit implementation once a future NG-005 designs its invocation workflow — until then, it does not exist in code, matching A-008's own framing of it as policy without a built mechanism yet.

## 17. White-label Principles

Branding/theming is **Organization-scoped, data-driven configuration** (read from Supabase per-Organization, per A-007 ID-04), never a build-time flag or a per-deployment configuration file. This is a principle, not a mechanism — the actual theming implementation approach is NG-001's job.

## 18. Multi-Tenant Principles

Organization is the platform's primary isolation boundary, restated here as a binding technical rule: enforced at the Supabase RLS layer (data) **and** at the Angular application layer (no shared service, cache, or store ever holds more than one Organization's data at a time for a given user session).

## 19. Performance Principles

Lazy-loaded feature modules; `OnPush` change detection as the default strategy; no premature optimization, but the "reference, don't duplicate" data-flow principle already established across A-007/A-008 extends naturally into avoiding redundant queries for the same data within one view.

## 20. Scalability Principles

Stateless Angular application (all durable state lives in Supabase, not server-side session state); static-build-plus-CDN hosting model; Supabase's own scaling is the backend team's concern, not this document's.

## 21. Configuration Management

Environment-based configuration (dev/staging/production); secrets never committed to source control; **Organization-specific white-label configuration is data (in Supabase), never environment configuration** — a critical distinction that keeps white-label changes from requiring a redeploy.

## 22. Environment Strategy

Dev → Staging → Production, each ideally backed by its own Supabase project/environment so Organization-isolation testing never risks real tenant data.

## 23. Build Standards

Angular CLI build pipeline; reproducible builds; build-time type-checking enforced in CI (never bypassed with a `--skip-type-checking`-equivalent flag).
