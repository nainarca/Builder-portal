# Application Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-001_Angular_Enterprise_Architecture.md`](NG-001_Angular_Enterprise_Architecture.md)
**Purpose:** The application-level (not folder-level, not routing-level) architecture for every product this platform governs.

## Application Boundaries — Three Independent Angular Applications

| Application | Audience | Authentication | Reuses |
|---|---|---|---|
| **Public Website App** | Public Visitor | None (unauthenticated) | `shared-ui`, minimal `shared-organization-context` (none needed pre-auth) |
| **Super Admin App** | Super Admin | Supabase Auth, Super Admin role only | `shared-ui`, `shared-auth`, `shared-rbac`, `shared-organization-context` (multi-Organization view mode), `shared-data-access` |
| **Builder Portal App** | Builder Organization Owner/Admin/Member | Supabase Auth, Builder-type Organization membership only | `shared-ui`, `shared-auth`, `shared-rbac`, `shared-organization-context` (single-Organization mode), `shared-data-access` |

**Owner Mobile App is not a fourth application in this workspace.** It is the existing, unmodified Flutter app (A-001 §8) — this platform's only relationship to it is the shared Supabase backend and the invitation deep-link handoff (A-005 §7). No Angular code is written for it, ever, by this series.

**Why three separate applications, not one app with route-level access control:** A-005 §8 already established that no product's Global Navigation ever merges with another's — Super Admin, Builder Portal, and Public Website are three navigationally, and now architecturally, disjoint surfaces. Splitting them at the *application* level (separate builds, separate deployable bundles) makes the isolation a build-time property, not a runtime one — a Builder Portal user's browser never even downloads Super Admin's code. This is the strongest available form of NG-000's "route guards are UX, not security" principle: the strongest boundary is the one that isn't just hidden, it isn't shipped.

## Feature Boundaries per Application

| Application | Features (map to A-007 §2.1's provisional Working Module Reference) |
|---|---|
| Public Website App | Marketing & Conversion (single feature — the product is small enough not to need further splitting) |
| Super Admin App | Builder Onboarding, Tenancy & Branding, Commercial, Operations |
| Builder Portal App | Project & Unit Preparation *(depends on the undesigned Builder Projects backend domain — see NG-001 §17 Risks)*, Handover, Reporting, Communication |

Every feature is an isolated library within its application — see `FEATURE_BOUNDARIES.md` for the isolation and cross-feature-communication rules governing them.

## Shared Platform

| Library | Purpose | Consumed by |
|---|---|---|
| `shared-ui` | Design System components (UI-001's eventual domain — this document only reserves the library boundary, not its contents) | All three apps |
| `shared-auth` | Supabase Auth session wrapper | Super Admin App, Builder Portal App (not Public Website — no session to wrap) |
| `shared-rbac` | Guards/directives derived from `PERMISSION_MATRIX.md` — the single implementation, never reimplemented per app | Super Admin App, Builder Portal App |
| `shared-organization-context` | Organization resolution/scoping — shaped differently per consumer (see NG-001 §16) | Super Admin App (multi-Org view), Builder Portal App (single-Org, fixed per session) |
| `shared-data-access` | Supabase client wrappers, one per Information Domain (A-007's 15 domains) — reused wherever a domain is touched by more than one app (e.g., ID-03 Organization is touched by both Super Admin and, indirectly, Builder Portal) | All apps needing backend data |
| `shared-models` | TypeScript interfaces mirroring A-007's information domains — shape contracts only, never a database schema restatement | All apps |

## Core Platform (per application, not shared — instantiated once per app bootstrap)

Each application owns its own Core: error boundary, logging, configuration resolution, and (where applicable) auth session + Organization Context + RBAC permission set resolution. Core is *not* a shared library reused verbatim across apps — each app's Core composes the same *shared* primitives (`shared-auth`, `shared-organization-context`, `shared-rbac`) into an app-specific bootstrap sequence, because Public Website's bootstrap (no auth) is legitimately different from Builder Portal's (auth → Organization Context → RBAC, in that order).

## Cross Product Services / Global Services / Platform Services

- **Cross Product**: none exist that literally span applications at runtime — the only cross-product relationship is the Public Website → Super Admin (Builder Registration) and Super Admin → Builder Portal (approval provisioning) handoffs, both mediated entirely through the Supabase backend, never a direct in-browser call between two Angular apps.
- **Global Services**: within a single app, services registered at the Core level (one instance for the app's lifetime) — Organization Context, Auth Session, RBAC Permission Set.
- **Platform Services**: the `shared-*` libraries themselves, in aggregate — "platform" here means "available to any app that needs it," not "running as a separate service."
