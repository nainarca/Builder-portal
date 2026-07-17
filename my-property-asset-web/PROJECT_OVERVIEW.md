# MyPropertyAsset — Project Overview

**Purpose of this document:** the single source of truth for onboarding any person or AI assistant (Claude, ChatGPT, Cursor, or otherwise) into this project. If a future conversation needs to understand what MyPropertyAsset is, who it's for, what already exists, what's in progress, and what rules govern how work gets done here, it starts with this document.

**Last verified against the live repository:** 2026-07-17. This document describes what was directly confirmed in the codebase, its migrations, its architecture series, and its V1 release documentation at that date — not aspiration. Where a documented architectural decision has not actually been implemented yet, that gap is stated explicitly rather than smoothed over; this project has a standing discipline (see `docs/ARCHITECTURE_INDEX.md`) of flagging aspirational-vs-actual gaps instead of letting them silently drift, and this document continues that discipline.

---

## 1. Executive Summary

**What is MyPropertyAsset?**

MyPropertyAsset is an **Enterprise Property Intelligence Platform** for the real estate and construction industry, built as two coordinated product lines:

- An existing **Flutter mobile app** for individual property owners, investors, and tenants to track their properties, loans, expenses, and documents.
- A new **Angular web platform** — a Super Admin Portal and a Builder Portal — built for large builders, real estate developers, construction companies, and institutional investors to run their property portfolio and owner-handover operations at enterprise scale, with an eventual white-label SaaS ambition.

**Why was it created?**

The Flutter app began as a property-tracking tool for owners and investors. As the business model expanded toward serving builders and developers directly — not just the owners who buy from them — it became clear that builders needed their own operational tool distinct from a consumer mobile app: a web portal for managing projects, buildings, units, owner assignments, documents, and the digital handover process, plus a platform-operator tool (Super Admin) to run the business of onboarding and supporting those builders. The web platform is that answer, and it is explicitly designed to eventually be sold under other companies' own branding (white-label).

**Who are the users?**

See §4 for the full breakdown — in short: property owners/investors/tenants (Flutter app), and builder staff, builder admins, and the platform's own internal Super Admin/support staff (Angular web platform).

**What problems does it solve?**

1. Owners previously had no dedicated way to track a property's full financial and operational lifecycle (loans, expenses, documents, handover status) — the Flutter app solves this.
2. Builders had no purpose-built tool to manage a multi-project portfolio, assign units to owners, track document approvals, or run a digital handover process — the Builder Portal solves this.
3. The platform's own operators had no way to onboard, support, or oversee multiple builder accounts safely and auditable — the Super Admin Portal, including its time-boxed, audited **Support Access** mechanism, solves this.
4. The web platform's user experience did not meet the bar a builder or institutional investor would expect from a premium enterprise product — this is the subject of an active, dedicated design initiative (§9, and the `docs/design/` series).

---

## 2. Vision

**Long-term vision:** MyPropertyAsset becomes the property-industry equivalent of what Salesforce is to sales or what a modern ERP is to manufacturing — an enterprise-grade, white-label-ready platform that any large builder or property investment company can run their entire owner-facing and back-office operation on, under their own brand.

**Mission:** give builders and institutional property owners a platform that is as trustworthy, precise, and premium in its user experience as the financial and legal weight of the transactions it manages — a property handover, a unit sale, a loan record — actually deserves.

**Business goals:**
- Win large builders, developers, construction companies, and institutional investors as enterprise customers of the web platform.
- Retain and grow the existing owner/investor/tenant base on the Flutter app.
- Build toward a white-label licensing model where a builder or investment company can present the platform as their own product to their own customers.

**Platform goals:**
- One coherent platform spanning: Owner Mobile App (Flutter, existing) → Builder Portal (Angular, in active build) → Super Admin Portal (Angular, in active build) → eventually a Tenant Portal, a Vendor Portal, and a public marketing website.
- A single enterprise design system and component architecture shared across every current and future web surface (see the `docs/design/` series), so the platform never again grows into a mismatched collection of independently-built screens.
- A real multi-tenant, white-label-capable data and authorization architecture underneath all of it.

---

## 3. Products

| Product | Platform | Status | Primary users |
|---|---|---|---|
| **Owner Mobile App** | Flutter (separate repository, `my_property_asset`) | Existing, actively developed. Self-reported ~82% MVP completion, ~71% production readiness, ~92% security score. Current focus: Android platform setup, Firebase, deep links, Crashlytics, beta testing. | Property owners, investors, NRI owners, tenants |
| **Super Admin Portal** | Angular web (this repository) | In active build. Core modules delivered to demo quality (see §9). | Platform admin / internal operations / support staff |
| **Builder Portal** | Angular web (this repository) | In active build. Core modules delivered to demo quality (see §9). | Builder admins and builder staff |
| **Public Website** | Angular web (this repository — `src/features/public-website`) | Feature folder exists in the codebase; scope/completeness not yet covered by the V1 release documentation reviewed for this overview — treat as early-stage relative to the two portals above. | Prospective builder customers, general public (unauthenticated) |
| **Future Tenant Portal** | Not yet built | Reserved in the platform's architecture series as a future application, no implementation yet. | Tenants renting from owners |
| **Future Vendor Portal** | Not yet built | Named as an example in this document's own brief; not yet present in any architecture document reviewed. Treat as unscoped — a future initiative would need its own product/architecture design before implementation, not an assumption carried in from this overview. | Contractors, vendors, service providers |

**Note on Loans/Expenses/Financial History:** these are, and are architecturally required to remain, an **owner-side (Flutter) domain only**. The web platform's own architecture has refused, on more than one occasion and at more than one layer (library structure, data-access/repository layer, physical folder structure), to build any Property/Loan/Expense capability into the Angular codebase. This is a deliberate, standing boundary — see §7 and §12 — not a gap to be filled by a future feature request.

---

## 4. Target Users

| Role | Where they operate | What they do |
|---|---|---|
| **Platform Admin (Super Admin)** | Super Admin Portal | Runs the platform itself: onboards and manages builder organizations, manages platform-wide settings, billing, and branding defaults, oversees the whole system. |
| **Builder** | Builder Portal | The builder organization's own admin — manages their projects, staff, owners, documents, handovers, branding, and subscription. |
| **Builder Staff** | Builder Portal | A builder organization's team member with operational (not administrative) permissions — contributes to day-to-day work without invite/delete/settings authority. |
| **Owner** | Owner Mobile App (Flutter); read-only touchpoints in Builder Portal (assignment, documents, handover) | The end customer who purchased or is assigned a unit — tracks their property, documents, loan, and handover status. |
| **Tenant** | Not yet a distinct platform user — tenant management exists today inside the Flutter app's owner-facing tools, not as its own portal | Rents a unit from an Owner; a dedicated Tenant experience is a reserved future product, not yet built. |
| **Support Team** | Super Admin Portal, via the Support Access mechanism | Platform staff who need temporary, explicit, time-boxed, audited access into a specific builder's data to resolve a support case — and who can never reach Restricted-Financial data under any circumstance. |
| **Internal Operations** | Super Admin Portal (Operations, Platform modules) | Internal staff running platform operations — monitoring, platform-level configuration, cross-organization oversight. |

---

## 5. Business Modules

| Module | Where it lives today | Notes |
|---|---|---|
| **Organizations** | Super Admin Portal, Builder Portal | The shared construct underlying both a builder's company account and (conceptually) an owner's organizational context. |
| **Builders** | Super Admin Portal (`builders`), Builder Portal (`organization`) | Builder company onboarding, staff invitations, settings. |
| **Projects** | Builder Portal (`projects`) | The primary organizing entity for a builder's portfolio; supports two hierarchy types — building-based or direct-units. |
| **Buildings** | Builder Portal (`projects/buildings`) | Nested under a Project; optional depending on the Project's hierarchy type. |
| **Floors** | Not implemented as a distinct entity | The current data model goes Project → Building → Unit directly; floors are not separately tracked at this time. |
| **Units** | Builder Portal (`projects/units`) | The individual sellable/assignable property unit; supports multiple inventory types. |
| **Owners** | Builder Portal (`owners`) | Cross-project owner/assignment directory, deliberately decoupled from platform login accounts until activation. |
| **Tenants** | Flutter Owner App only | Tenant management is an owner-facing capability inside the mobile app today, not a Builder/Super Admin web capability. |
| **Loans** | Flutter Owner App only — **explicitly excluded from the web platform** | See the Restricted-Financial boundary in §3, §7, and §12. |
| **Expenses** | Flutter Owner App only — **explicitly excluded from the web platform** | Same boundary as Loans. |
| **Financial History** | Flutter Owner App only — **explicitly excluded from the web platform** | Same boundary as Loans/Expenses. |
| **Documents** | Builder Portal (`documents`) | Document categories, versioning, and an approval workflow; does not yet include real file upload/Storage/PDF viewing. |
| **Digital Handover** | Builder Portal (`handovers`) | An 8-stage handover pipeline (initiation through completion/possession certificate), the platform's flagship operational workflow. |
| **Notifications** | Builder Portal (`communications`), Flutter Owner App | A communications/notification hub on the builder side; native push/notification handling on the Flutter side. |
| **Reports / Analytics** | Not yet built as its own destination | Currently scattered across dashboard widgets; a dedicated Analytics surface is a named design recommendation (`docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §8), not yet implemented. |
| **Billing** | Super Admin Portal (`billing`), Builder Portal (`subscription`) | Platform-side billing oversight and the builder's own subscription/billing management. |
| **Branding** | Super Admin Portal (`branding`), Builder Portal (`branding`) | The white-label configuration surface. |
| **White Label** | Cross-cutting (Branding modules + theme architecture) | A deliberately bounded customization surface — see §7 and the `docs/design/` series. |

---

## 6. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend (web)** | Angular 20 (standalone components, Signals-first state, zoneless change detection), PrimeNG 20 with PrimeUIX Themes, PrimeFlex, TypeScript 5.9 | A single Angular CLI workspace (`my-property-asset-web`), not the Nx monorepo originally decided in the architecture series — see the gap noted in §7. |
| **Frontend (mobile)** | Flutter (SDK ≥3.22), Riverpod (state management, with code generation) | Separate repository (`my_property_asset`). |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions, Storage, Realtime) | One shared Supabase project underlies both the Flutter app and the Angular web platform; a Razorpay payment integration exists as an Edge Function on the Flutter/owner side. |
| **Database** | Supabase PostgreSQL, with Row-Level Security (RLS) as the multi-tenant isolation mechanism | Schema completeness and RLS coverage are currently partial for the web platform's newer modules — see §9's honest scoring. |
| **Authentication** | Supabase Authentication, exclusively — no parallel auth mechanism | The web platform models identity as three separate contexts (Authentication, Organization, User), each its own reactive state, rather than one monolithic auth object. |
| **Hosting** | Not yet finalized in the reviewed documentation/codebase | A five-tier environment strategy (Development/QA/UAT/Staging/Production) and a blue/green, build-once-promote-many deployment model are architected; four environment configuration files exist in the codebase (`development`, `qa`, `staging`, and a default), but an actual hosting provider and CI/CD pipeline were not found configured. |
| **CI/CD** | Local git hooks only (Husky, lint-staged, Commitlint) confirmed in the repository | No GitHub Actions workflow or equivalent CI pipeline exists in the repository as reviewed; this is a known gap relative to the architected deployment strategy, not a secret. |
| **Storage** | Supabase Storage — architected, not yet wired up | Document Management's actual file upload/preview capability is explicitly a placeholder today (§9). |
| **Analytics** | Not yet implemented as a product surface | See "Reports / Analytics" in §5 and the Analytics Blueprint in `UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md`. |

---

## 7. Architecture

**High-level architecture:** two client applications (Flutter mobile, Angular web) sitting on one shared Supabase backend. The Angular web platform is itself two portals — Super Admin and Builder — built from a single shared enterprise component/design system (see the `docs/design/` series) rather than two independently-styled applications.

**Platform structure (as architected vs. as actually built):** the architecture series (`docs/technical/NG-001`, ADR-009) called for three independent Angular applications inside an Nx monorepo (ADR-010). **As actually built, this is one Angular CLI workspace with a single project** (`angular.json` lists exactly one project). This is a genuine, standing gap between decided architecture and current implementation — flagged here explicitly rather than assumed resolved, consistent with this project's own documentation discipline.

**Multi-tenant model:** Organization is the shared construct underneath both a Builder's company account and (conceptually) an Owner's context. Tenant isolation is intended to be enforced at the database layer via RLS — coverage of this is currently incomplete for the platform's newer modules (subscriptions, communications, platform management, branding), a known production-readiness risk tracked in the V1 release documentation (§9).

**White-label model:** a deliberately narrow, bounded customization surface — primary/brand accent color, logo, and one reserved secondary accent — with all semantic/status colors, spacing, typography, and structural component behavior permanently non-overridable regardless of white-label tier. Fully specified in `docs/design/P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md` §25 and elaborated in `P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md` §10.

**Authentication model:** Supabase Authentication is the sole mechanism; identity is resolved as three independent Signals — Authentication Context, Organization Context, User Context — never one combined object. This is what allows Support Access to be modeled cleanly as an *extension* of Super Admin context rather than a role switch.

**Authorization model:** role-based access control against a documented Permission Matrix, with two absolute, standing rules that override everything else:
1. **The Restricted-Financial exclusion** — Properties, Loans, Expenses, and Financial History have no library, no repository/data-access code, and no folder anywhere in the Angular codebase, checked at multiple independent layers (library boundary, data-access boundary, physical folder structure, logging/observability). This is a permanent architectural wall, not a temporarily-unbuilt feature.
2. **Support Access** — a Super Admin operator's access into a specific builder's data is explicit, time-boxed, and audited per invocation, and can never reach Restricted-Financial data under any circumstance.

---

## 8. Repositories

| Repository | Remote | Contents |
|---|---|---|
| **`my-property-asset-web`** | `github.com/nainarca/Builder-portal` (this repository) | The Angular web platform (Super Admin Portal, Builder Portal, Public Website), its own Supabase migrations (`supabase/migrations/`), and the full `docs/` architecture, technical, design, and release documentation series. |
| **`my_property_asset`** | `github.com/nainarca/my_property_asset` | The Flutter Owner Mobile App, plus the backend's original master architecture and platform foundation specification documents (`MASTER_ARCHITECTURE.md`, `PLATFORM_FOUNDATION_SPECIFICATION.md`) and the Expense/Loan/Financial History IES design documents. |
| **Supabase** | Not a separate repository | One shared Supabase project. Its migrations are tracked inside `my-property-asset-web/supabase/migrations/` — this is the authoritative location. A similarly-named `supabase/` folder exists at the parent workspace level, but it contains only local Supabase CLI temp state, not a separate source of truth — worth knowing so it's never mistaken for a second migrations history. |
| **Shared Assets** | Not a formal repository | No dedicated shared-assets repository currently exists. Cross-cutting files (e.g. Firebase/Google Services configuration) currently live loose at the parent workspace directory rather than in a managed location — an organizational gap to be aware of, not a designed structure. |

---

## 9. Current Status

**As of the most recent formal readiness assessment (V1.0 Executive Report, dated 2026-07-16):**

| Dimension | Score | Note |
|---|---:|---|
| Product/UX module completeness (P1–P16) | 92/100 | All planned V1 modules present in the Angular UI |
| Database schema completeness | 72/100 | Units and Owner Assignment SQL missing; blocks later handover foreign keys |
| Security — Angular RBAC | 80/100 | Strong guards/matrix; Support Access role needs more depth |
| Security — Supabase RLS (live) | 45/100 | Early modules covered; newer modules (B08–B12) lack RLS |
| Data layer production wiring | 35/100 | Still largely in-memory/mock repositories, not live Supabase-backed |
| Testing | 70/100 | Unit test suite green (77/77); no automated end-to-end/live-integration tests yet |
| Ops/deployment readiness | 55/100 | Documentation complete; environment isolation incomplete |
| Documentation | 90/100 | Full V1 release documentation pack delivered |
| **Overall production readiness** | **62/100** | Formal decision: **NO-GO for commercial production launch; GO for a controlled stakeholder/sales demo** |

**Module completion (UI/feature delivery): ~94%.** Every planned V1 module (Platform Foundation, Authentication, Builder Organization, Project/Building/Unit Management, Owner Assignment, Digital Handover, White-Label Branding, Communication Hub, Subscription & Billing, Super Admin Platform) has a working Angular UI. The remaining gap is production data persistence, not missing screens.

**Backend/Database:** Supabase PostgreSQL with migrations through the Platform Management batch (B12). Units (B05) and Owner Assignment (B06) SQL are the two confirmed missing pieces blocking a fully live handover data chain; Row-Level Security is not yet applied to the newer modules.

**Flutter (Owner Mobile App):** self-reported ~82% MVP completion, ~71% production readiness, ~92% security score, per the app's own project context documentation. Current focus there: Android platform setup, Firebase integration, deep links, Crashlytics, and beta testing — entirely independent of the web platform's own workstreams.

**Enterprise Design System:** the platform's premium-UX initiative has produced, in order: `P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md` (product design philosophy, tokens, and rules — approved), `P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md` (the full reusable Shell/Layout/Card/Navigation/Form/Table/Dialog/Feedback/Chart/Theme component inventory — approved), and a first real implementation wave already merged into the codebase: an Enterprise Application Shell, Sidebar navigation, a shared Component Library, Form & Wizard framework, Data Table framework, and Dashboard & Analytics framework, followed by a modernization pass applied to the Super Admin Portal, the Builder Portal, Authentication/onboarding screens, and Organization & Workspace Management screens.

**UI Rebirth:** `UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` — a from-first-principles UX reimagination, grounded in a direct audit of the current implementation — is complete as a design blueprint with a five-phase implementation roadmap. It has **not yet been implemented**; several of its findings (decorative sidebar nesting, an inert workspace-switcher control, inconsistent Detail-page and List-page patterns between entities) were confirmed present even after the modernization pass above, meaning that pass improved the underlying system without yet resolving every inconsistency this blueprint identifies.

**Current Sprint:** the active branch (`feature/auth-02-login-loading-fix`) is a targeted bug fix — a login hang caused by a re-entrant authorization-resolution loop introduced by a prior Super Admin access fix — marked fixed in code as of 2026-07-16, pending manual verification of the Super Admin login path.

---

## 10. Current Focus

Right now, work is concentrated on three concurrent threads:

1. **Closing out the AUTH-02 login-loading bug fix** (§9) with manual verification of the Super Admin login flow before it's considered fully resolved.
2. **Continuing the Enterprise Design System rollout** — the modernization pass has covered the Application Shell, Super Admin, Builder Portal, Authentication, and Organization/Workspace screens; remaining screens (Projects, Units, Owners, Documents, Handovers, and their Super Admin equivalents) still need to be brought onto the new Shell/Component/Layout system.
3. **Working through the UI-REBIRTH-01 roadmap's Phase 0/Phase 1 items** — enforcing the spacing/color token system consistently (a large amount of one-off spacing/color values still exist in feature-level styling), wiring the workspace switcher to real behavior, fixing decorative sidebar nesting, and unifying the Detail-page pattern (real tabs for non-sequential entities like Projects, a real Stage Tracker for sequential processes like Handovers).

Not currently being worked: the V1 production-blocking items (Units/Owner Assignment SQL, RLS completion, live Supabase repository wiring, environment isolation) — these remain the **next** major milestone after the current UX-focused work, per the V1 Roadmap's own "Immediate (pre-production gate)" list (§11).

---

## 11. Roadmap

**Current phase:** Post-V1 UX Rebirth — implementing the Enterprise Design System and UI-REBIRTH-01 blueprint across the remaining screens (§10), while V1's production-blocking backend gaps remain open and explicitly deferred, not abandoned.

**Next phase — V1 pre-production gate (per `docs/releases/V1_ROADMAP.md`):**
1. Complete Units and Owner Assignment SQL (or formally align that gap to the Flutter side's Schema V2).
2. Apply Row-Level Security to Handover, Branding, Subscription, Communications, and Platform tables.
3. Replace in-memory/mock repositories with real Supabase-backed implementations behind the existing repository abstractions.
4. Stand up environment-isolated Supabase projects (currently shared across tiers).
5. Build automated end-to-end tests for the platform's six core V1 scenarios.

**Near-term (V1.1):** a live payment provider integration, invoice PDF generation and storage, error tracking (e.g. Sentry or Application Insights), deeper Support-user RBAC and a dedicated support-access-grant UX, and further bundle-size reduction.

**Mid-term (V1.2+):** advanced analytics built on settled revenue data, real-time communication delivery, custom-domain and commercial API-access flags, a real UAT tier with a promotion pipeline, and performance/load testing.

**Future vision:** the white-label, multi-tenant SaaS model described in §2 — including the Tenant Portal and Vendor Portal named as future products in §3, and a fully-built-out Public Website — none of which are scheduled against a committed date as of this document.

**Explicitly out of scope for V1** (per the same roadmap): redesigning already-completed modules outside the current UX Rebirth initiative, any Flutter Owner App feature work performed from this repository, and any new business vertical not already named above.

---

## 12. Project Rules

**Architecture rules**
- No architecture document authorizes implementation until it carries a human-granted **Approved** status — Draft status blocks code generation, no exceptions. As of the most recent architecture review, most of the platform's foundational A-series/NG-series documents remain formally un-approved even though implementation has, in practice, proceeded ahead of that gate — this is a known, explicitly tracked tension (see `docs/ARCHITECTURE_INDEX.md` §5–§6), not a secret or an oversight to quietly correct by pretending it isn't true.
- Every architecture decision gets an ADR (Architecture Decision Record) in `docs/adr/ADR_INDEX.md` — decisions are never made silently inside an unrelated document.
- Gaps, contradictions, and aspirational-vs-actual mismatches are named explicitly in the document that finds them, not silently resolved or hidden.

**Coding rules**
- Angular: standalone components only (no NgModules), Signals-first state management, zoneless change detection.
- Data access goes through the Repository pattern exclusively — no Feature, Service, or Component ever calls the Supabase client directly.
- The Restricted-Financial boundary (§7) is absolute: no `property`, `loan`, or `expense` path may ever exist anywhere under the Angular codebase's feature or library folders.

**Documentation rules**
- `docs/ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md` are the two registries of record — any new architecture document gets listed there, not left to be discovered.
- Documents state their own dependencies and approval status plainly at the top; a document's traceability to what it depends on is treated as part of its content, not optional metadata.

**Design rules**
- Governed by the `docs/design/` series (`P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md`, `P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md`, `UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md`). Core non-negotiables: exactly one primary action per screen, exactly one accent color doing interactive work per screen, semantic status colors that are never decorative and never white-label-overridable, an 8pt spacing scale with no off-grid values, and no new visual pattern invented inside a single feature screen — new patterns are designed once at the shared component layer and reused everywhere.

**Database rules**
- The Restricted-Financial exclusion (§7) applies at the database/API layer exactly as it does in code — no repository, RPC, or endpoint for Properties, Loans, or Expenses is ever built into this platform's own backend surface.
- Row-Level Security is the mandatory tenant-isolation mechanism for any table exposed to more than one organization — a table without RLS should not be treated as safe to expose live, regardless of how complete its schema looks (this is precisely the gap the current V1 audit flags as a risk, §9).

**Security rules**
- Supabase Authentication is the sole authentication mechanism — no parallel auth system is ever introduced.
- Support Access is explicit, time-boxed, and audited per invocation, and can never reach Restricted-Financial data under any circumstance, full stop.
- WCAG 2.1 AA is the platform-wide accessibility conformance target.

---

## 13. AI Working Rules

This platform has an existing, explicit governance model for AI-assisted work (`docs/technical/AI_DEVELOPMENT_GUIDE.md`), and every future AI assistant working on this project — Claude, Cursor, ChatGPT, or otherwise — is bound by it:

| Tool role | What it is allowed to produce |
|---|---|
| **Claude (architecture & design & documentation)** | Markdown documentation only — architecture documents, design blueprints, reviews, gap analyses, diagrams (as Mermaid/text), matrices. **Never production code, SQL, or Angular of any kind**, even under the guise of "just an example" or "just architecture." |
| **Cursor AI (implementation)** | Actual Angular/TypeScript code, tests, and configuration — but strictly from an already-**Approved** architecture or design document, never from an undocumented assumption. |
| **Any AI tool** | Never self-approves its own output. Approval of any document or any code is always a human act. |

**What future AI assistants should never change:**
- The Restricted-Financial exclusion boundary (§7, §12) — never build Property/Loan/Expense capability into the Angular web platform, under any framing.
- Supabase Authentication as the sole auth mechanism — never introduce a parallel or competing auth approach.
- The approval-gate model itself — never generate implementation code against a document whose status is Draft, and never declare a document "approved" on an AI's own authority.
- Semantic/status color meaning and its non-overridable status under white-labeling (§7, §12) — brand customization never touches danger/warning/success/info colors.
- An entity's existing URL structure, route ownership, or data model, without a corresponding approved architecture document authorizing the change.

**What future AI assistants should always preserve:**
- **Traceability.** New work should be identifiable against the architecture/design document and section it implements — this project has consistently practiced citing its own sources, and that discipline should continue.
- **Explicit gap-flagging over silent resolution.** If a prompt asserts something contradicted by an existing document, or if a document is silent on a needed behavior, the correct response is to flag it and escalate — not to quietly invent an answer or quietly "fix" the discrepancy without saying so. This project's own documentation series has modeled this behavior consistently (e.g. the Restricted-Financial refusals, the Nx-monorepo-vs-actual-single-app gap noted in §7 of this very document) and it is the standard every future contributor, human or AI, is expected to meet.
- **The one-system-many-surfaces design discipline** (§12) — consistency across Super Admin and Builder Portal is treated as a first-class requirement, not a nice-to-have, given how directly it affects this platform's credibility with the enterprise buyers it's built for.
- **Human approval as the final word**, at every layer — architecture, design, and code alike.
