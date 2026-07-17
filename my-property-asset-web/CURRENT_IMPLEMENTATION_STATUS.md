# MyPropertyAsset — Current Implementation Status

**Document type:** Living status document — CTO / Release Manager view. Updated as the project progresses; every future AI conversation should read this document to understand exactly where the project stands before doing any work.
**Last verified against the live repository:** 2026-07-17, cross-checked against `docs/releases/V1_*` (dated 2026-07-16), the `supabase/migrations/` directory (11 applied migrations, verified by direct inspection), the `docs/design/DS_0X_*` implementation reports, and recent commit history.
**Companion document:** `PROJECT_OVERVIEW.md` (what the project is). This document is about **where it currently stands.**

---

## 1. Executive Summary

| | |
|---|---|
| **Overall completion (feature/UI delivery)** | **~94%** of planned V1 modules have a working Angular UI |
| **Overall completion (production readiness)** | **62/100** — see §14 |
| **Current project phase** | Post-V1 **Enterprise Design System / UX Rebirth** implementation, running concurrently with unresolved V1 production-hardening gaps |
| **Current sprint** | `feature/auth-02-login-loading-fix` — a login-hang bug fix marked fixed in code, pending manual verification |
| **Release target** | V1.0 is tagged and demo-ready (`package.json` version `1.0.0`); **no production launch date is set**, and the formal V1 recommendation is explicitly **NO-GO for commercial production / GO for controlled demo only** |

**One-paragraph state of the project:** every planned V1 business module (Platform Foundation, Authentication, Builder Organization, Projects, Buildings, Units, Owner Assignment, Digital Handover, White-Label Branding, Communication Hub, Subscription & Billing, Super Admin Platform) has a working Angular screen, and a real Supabase schema exists for most of them. What is **not** yet true: two schema pieces (Units, Owner Assignment) are missing entirely, Row-Level Security is applied to only 6 of 27 tables, and the large majority of business data is still served from in-memory/mock repositories rather than live Supabase queries. Layered on top of that, a platform-wide Enterprise Design System is being rolled out (four of an expected six framework phases documented and implemented, two implemented but undocumented, plus a further modernization pass across four surfaces) — this is genuinely improving the product but is itself still mid-rollout, not complete.

---

## 2. Backend Status

Scored against: does a real Supabase schema exist, is RLS applied, is the Angular repository layer live or mock, and what remains.

| Module | Status | Completed % | Remaining work | Dependencies |
|---|---|---|---|---|
| **Authentication** | Demo-complete | ~90% | Live JWT-dependent business CRUD not yet exercised (repositories are in-memory); invitation token hashing/expiry needs verification once live | Supabase Auth (live), P6B Platform Security SQL |
| **Organizations** | Demo-complete | ~90% | Live repository wiring; full RLS | P6A/P6B SQL, P7 SQL |
| **Builders** | Demo-complete | ~90% | Same as Organizations — Builder onboarding shares the P7 vertical slice | P7 SQL, invitation flow |
| **Projects** | Demo-complete | ~90% | Live repository wiring; RLS present but unverified end-to-end | P8 SQL |
| **Buildings** | Demo-complete | ~90% | Live repository wiring | P9 / P9.1 SQL |
| **Units** | UI complete; schema missing | ~65% | **Units SQL (B05) does not exist in the repository** — this is a Critical item blocking the handover data chain | Blocks: Digital Handover live SQL |
| **Owners** | UI complete; schema missing | ~65% | **Owner Assignment SQL (B06) does not exist in the repository** — same blocking pattern as Units | Blocks: Digital Handover live SQL |
| **Loans** | **Out of scope for this platform, by design** | N/A | None — this is a Flutter Owner App domain and is architecturally excluded from the web platform (see `PROJECT_OVERVIEW.md` §7) | Flutter app only |
| **Expenses** | **Out of scope for this platform, by design** | N/A | Same exclusion as Loans | Flutter app only |
| **Financial History** | **Out of scope for this platform, by design** | N/A | Same exclusion as Loans | Flutter app only |
| **Documents** | UI complete; no dedicated schema found | ~60% | No dedicated SQL migration for Documents was found among the 11 applied migrations; file upload is metadata-only (no real binary Storage pipeline) | Supabase Storage wiring |
| **Notifications** | Demo-complete (Communication Hub) | ~85% | Real-time delivery not yet live; currently a builder-side hub, not a cross-cutting notification service | P14 (B11) SQL |
| **Reports** | Not yet a dedicated module | ~15% | No dedicated Analytics surface exists; currently scattered dashboard widgets only. A full blueprint exists (`UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §8) but is unimplemented | Design blueprint exists; no build started |
| **Digital Handover** | UI complete; SQL blocked | ~65% | SQL (P12/B08) exists but **cannot apply cleanly** on a clean database because it depends on the missing Units/Owner Assignment tables | Blocked by Units (B05), Owner Assignment (B06) |
| **White Label / Branding** | Demo-complete | ~90% | Live repository wiring; storage-bucket policy review incomplete for branding assets | P13 (B09) SQL |

---

## 3. Database Status

**Schema version:** no formal semantic schema version is tagged; the schema is tracked as a sequential Supabase migration chain, currently at migration batch **B12 (Platform Management)**, timestamped 2026-07-16.

**Migration status:** 11 migrations applied to the tracked chain, each with a matching verification script in `supabase/migrations/verify/`. No pending/unapplied migration files exist in the repository — the gap is **missing migrations that were never written**, not a backlog of unapplied ones.

**Applied migrations (chronological):**

| Batch | Migration | Covers |
|---|---|---|
| B01A / P6A | Platform Foundation | Core platform tables (foundation only — no new tables of its own; supporting functions) |
| P6B | Platform Security | Security/RBAC foundation tables and the majority of the platform's helper functions |
| B02 / P7 | Builder Organization | Builder company + staff invitation tables |
| B03 / P8 | Builder Projects | Project table and lifecycle |
| B04 / P9 | Builder Buildings | Building table |
| B05 / P9.1 | Project Hierarchy | Additive hierarchy columns/logic (no new tables) |
| B08 / P12 | Digital Handover & Owner Activation | Handover pipeline tables (largest single migration by table count) |
| B09 / P13 | White-Label Branding | Branding configuration table |
| B11 / P14 | Builder Communication Hub | Communication/notification tables |
| B10 / P15 | Subscription & Billing | Subscription/billing tables |
| B12 / P16 | Platform Management | Platform-level management tables |

**Pending migrations (known, not yet written):**
- **Units (B05 business schema — not to be confused with the P9.1 hierarchy migration above, which reused the "B05" label for a different, additive change)** — missing entirely.
- **Owner Assignment (B06)** — missing entirely.

These two are the single most consequential gap in the current database status: the Digital Handover schema (B08) references both and cannot be applied to a clean database until they exist.

**Tables:** 27 created across all applied migrations.

**Functions:** 47 created (`CREATE OR REPLACE FUNCTION`), heavily concentrated in the Platform Security migration (18 of the 47).

**Triggers:** 11 created.

**Policies (Row-Level Security):** 15 policies exist, but they cover only **6 tables out of 27** — concretely, RLS is enabled (`ENABLE ROW LEVEL SECURITY`) on tables in the Platform Security, Builder Organization, Builder Projects, and Builder Buildings migrations only. **Every table created from the Digital Handover migration onward (B08 through B12 — Handover, Branding, Communications, Subscription/Billing, Platform Management) has zero RLS policies.** This is the same gap the V1 Security Audit rates Critical (finding S1).

**Indexes:** 51 total (43 standard + 8 unique).

**Known issues:**
1. Units and Owner Assignment schema missing — blocks a clean apply of the Digital Handover migration (Critical, per V1 Security Audit S2).
2. 21 of 27 tables (every table from B08 onward) have no RLS policy at all (Critical, S1).
3. All environment tiers (development/QA/staging) currently point at the same shared Supabase project — no environment isolation exists yet (High, S3).
4. Because business data is served from in-memory Angular repositories rather than live queries, the *absence* of live RLS enforcement is currently masked — enabling live Supabase access before RLS is complete would create an immediate cross-tenant exposure risk (High, S4).
5. Storage bucket policies for branding assets have not been fully audited (Medium, S6).

---

## 4. Flutter Status

**Completed modules** (per the Flutter app's own project documentation): Property Management, Portfolio Dashboard, Property Dashboard, Tenant Management, Loan Tracking, Expense Tracking, Document Vault, Timeline, Notifications, Razorpay payment integration, Subscription Management.

**Pending modules / current focus:** Android platform setup, Firebase integration, deep links, Crashlytics, beta testing.

**Production readiness (self-reported by the Flutter app's own tracking, not independently re-verified for this document):**
- MVP completion: ~82%
- Production readiness: ~71%
- Security: ~92%

**Note:** Flutter work is tracked entirely in the separate `my_property_asset` repository and is explicitly out of scope for any work done from `my-property-asset-web` (§12's project rules) — its status is reported here for completeness only, not as something this repository's roadmap should attempt to move.

---

## 5. Angular Status

**Completed modules (working UI, per the V1 Module Completion Matrix):** Platform Foundation, Authentication, Builder Organization, Project Management, Building Management, Project Hierarchy, Universal Unit Management (UI only — SQL gap), Owner Assignment (UI only — SQL gap), Digital Handover, White-Label Branding, Communication Hub, Subscription & Billing, Super Admin Platform.

**Current modernization status:** a platform-wide Enterprise Design System rollout is underway (§6). A first implementation wave (Application Shell, Sidebar, Component Library, Form & Wizard framework, Data Table framework, Dashboard & Analytics framework) has shipped, followed by a modernization pass already applied to: Super Admin UI/UX, Builder Portal UI/UX, Authentication & onboarding UI/UX, and Organization & Workspace Management UI/UX. Remaining feature areas (Projects, Units, Owners, Documents, Handovers screens themselves, beyond the shared shell/chrome they already inherit) have **not yet** been individually migrated onto the new system.

**Enterprise Design System status:** see §6 for full detail — 4 of 6 expected framework phases have both a shipped implementation and a written report; 2 more phases were implemented in code but have no corresponding written report yet.

**UI implementation status:** ~94% of planned V1 screens exist and function against mock/in-memory data. A dedicated UX audit (`UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md`) found real, specific inconsistencies still present even after the modernization pass above (§7) — the visual system is being built faster than every individual screen is being brought into full compliance with it.

**Pending modules:** a dedicated Analytics/Reports surface (not yet started, §2), live Supabase repository wiring for nearly every business module (§9), and the remaining UI-REBIRTH-01 roadmap phases (§7).

---

## 6. Enterprise Design System

| Phase | Subject | Status |
|---|---|---|
| **P0** | Enterprise Product Design System — philosophy, visual language, tokens, rules | **Approved.** `docs/design/P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md` |
| **P0.1** | Enterprise Design System Architecture — full Shell/Layout/Card/Navigation/Form/Table/Dialog/Feedback/Chart/Theme component inventory | **Approved.** `docs/design/P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md` |
| **DS-01** | Enterprise Application Shell | **Implemented.** `docs/design/DS_01_IMPLEMENTATION_REPORT.md` — shared `app-application-layout` now composes Header/Sidebar/Workspace/Breadcrumb/Toolbar/Content/Footer regions for both portals |
| **DS-02** | Enterprise Sidebar Navigation | **Implemented.** `docs/design/DS_02_IMPLEMENTATION_REPORT.md` — icon-rail sidebar with hover expansion, grouped/nested (max 2-level) navigation, workspace indicator, Favorites/Recent placeholders |
| **DS-03** | Enterprise Component Library | **Implemented.** `docs/design/DS_03_COMPONENT_LIBRARY_REPORT.md` — buttons, cards, KPI widgets, status/badge components, avatars, empty states, loading/skeleton components under `src/shared/ui/enterprise/` |
| **DS-04** | Enterprise Form & Wizard Framework | **Implemented.** `docs/design/DS_04_ENTERPRISE_FORM_FRAMEWORK.md` — reusable form shell (header/state/layout/sections/actions) and wizard shell (steps/review/confirmation/completion), presentation-only |
| **DS-05** | *(expected: Enterprise Data Table Framework)* | **Implemented in code, not yet documented.** Commit history confirms a "Data Table Framework" was built, but no `DS_05_*` report exists in `docs/design/` — a documentation gap, not an implementation gap. Should be written up before being treated as formally closed. |
| **DS-06** | *(expected: Enterprise Dashboard & Analytics Framework)* | **Implemented in code, not yet documented.** Same pattern as DS-05 — a "Dashboard & Analytics Framework" commit exists, no corresponding written report. |

**Beyond DS-06:** four further "modernize X UI/UX with Enterprise Design System" commits exist for Super Admin, Builder Portal, Authentication, and Organization & Workspace Management — these apply the DS-01–06 frameworks to real screens but are not themselves numbered or individually documented as DS phases. Whoever picks this series back up should decide whether to retroactively number/document them or treat "modernization passes" as a distinct, differently-tracked category from the DS-0X framework-build phases.

---

## 7. UI Rebirth

**UI-REBIRTH-01** (`docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md`) is complete as a design document: a from-first-principles UX reimagination built on a direct, evidence-based audit of the live codebase rather than assumption.

**Design philosophy approved:** "quiet confidence" — clarity over cleverness, one consistent system across both portals, restraint as a brand attribute, emotion reserved for genuinely momentous product moments (e.g. handover completion).

**Approved UX direction:** unify the Detail-page pattern (real tabs for non-sequential entities like Projects; a real Stage Tracker for sequential processes like Handovers), collapse the dashboard to four fixed zones, enforce one primary action per screen, decide and document the card/table-toggle rule per entity type rather than leaving it inconsistent, introduce a command palette, give Super Admin its own exception-first dashboard shape distinct from the Builder Portal's.

**Implementation readiness:** **not yet implemented.** A five-phase roadmap exists (Phase 0 Foundation Integrity → Phase 1 Demo-Critical Fixes → Phase 2 Systemic Consistency → Phase 3 Power and Delight → Phase 4 White-label Readiness). Re-auditing after the DS-01–06 modernization pass (§6) confirmed several of the blueprint's core findings — decorative sidebar nesting, an inert workspace-switcher control, inconsistent Detail-page patterns between Projects and Handovers, Organizations lacking the card/table toggle Projects has — are **still present**, meaning the modernization pass improved the underlying system without yet resolving the specific inconsistencies this blueprint exists to fix. This is expected, not a failure: DS-01–06 built the *system*; UI-REBIRTH-01's roadmap is what actually rewires each *screen* to use it correctly.

---

## 8. Business Module Status

| Module | Completed | In Progress | Pending |
|---|---|---|---|
| **Organizations** | Core CRUD, invitation flow, Super Admin oversight UI | Live repository wiring | Full RLS verification end-to-end |
| **Builders** | Onboarding, staff invitation, activation/deactivation UI | Live repository wiring | — |
| **Projects** | Full CRUD, hierarchy typing (building-based / direct-units), list/detail UI | DS modernization onto new Shell/Component system | Live repository wiring; Detail-page tab unification (UI-REBIRTH-01) |
| **Buildings** | Full CRUD nested under Project | — | Live repository wiring |
| **Floors** | — | — | **Not implemented as a distinct entity.** Current hierarchy is Project → Building → Unit directly; introducing Floors would require a new architecture decision, not just a build task |
| **Units** | Full CRUD UI, multiple inventory types | — | **Units SQL schema (B05) — does not exist; Critical gap** |
| **Owners** | Assignment/invitation UI, cross-project directory | — | **Owner Assignment SQL (B06) — does not exist; Critical gap** |
| **Customers** | No entity distinct from "Owners" exists | — | If a genuinely separate Customer concept (distinct from a unit Owner) is needed, that requires its own architecture decision — not assumed equivalent to Owners in this status document |
| **Documents** | Categories, versioning, approval workflow UI | — | Dedicated SQL schema; real file Storage/binary upload pipeline (currently metadata-only) |
| **Digital Handover** | Full 8-stage pipeline UI, owner activation contract | — | SQL blocked by Units/Owner Assignment gap; live wiring |
| **Reports** | — | — | **No dedicated module exists.** Only scattered dashboard widgets today; full Analytics blueprint designed (`UI_REBIRTH_01...` §8) but unbuilt |
| **Settings** | Builder Portal and Super Admin settings screens exist | DS modernization | Live repository wiring for settings persistence |

---

## 9. Known Technical Debt

**Architecture debt**
- The architecture series decided a three-application Nx monorepo (ADR-009/ADR-010); the actual repository is a single Angular CLI workspace with one project. This gap has stood since the decision was made and has not been revisited.
- Support Access (the Super Admin delegated-access mechanism) lacks the deep resource-level RBAC matrix its design calls for (V1 Security Audit S5).

**UI debt**
- Every specific inconsistency catalogued in `UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §19 remains open: decorative sidebar nesting, an inert workspace switcher, two incompatible Detail-page patterns (Projects vs. Handovers), Organizations missing the card/table toggle Projects has, one-off spacing/color values in feature-level styles (e.g. roughly fifteen one-off values found in a single Organizations stylesheet alone), mixed action idioms (buttons vs. plain links) on the same page family.
- DS-05 and DS-06 have no written implementation report despite shipped code (§6) — a documentation debt that risks the next contributor not knowing those frameworks exist.

**Performance debt**
- Initial production bundle is ~2.2MB against a 1.45MB warning budget (V1 Performance Review) — over budget, not yet remediated.
- No CDN-level data caching; image optimization pipeline is limited.
- Real API-latency behavior has never been validated, since nearly all business data is currently in-memory/mock.

**Testing debt**
- No automated end-to-end (E2E) suite exists (e.g. Playwright) — the six core V1 business workflows are validated by a manual checklist only (`V1_WORKFLOW_VALIDATION.md`).
- No live-integration tests against a real Supabase instance — the unit suite exercises Angular logic against mocks, not real RLS/query behavior.
- No accessibility audit has been completed — WCAG 2.1 AA is the stated target, but conformance is unverified ("full WCAG audit pending," V1 Performance & UX Review).

**Documentation debt**
- DS-05/DS-06 implementation reports missing (see above).
- The four "modernize X UI/UX" commits since DS-04 have no individual design/implementation documentation at all.
- Several A-series/NG-series foundational architecture documents remain formally un-approved despite implementation having proceeded ahead of that gate — a standing, explicitly tracked tension (`docs/ARCHITECTURE_INDEX.md` §5).

---

## 10. Testing Status

| Category | Status |
|---|---|
| **Unit tests** | **77/77 passing** (Karma/Jasmine, ChromeHeadless) as of the last recorded run (2026-07-16). Coverage is Angular-side logic against mocked dependencies. |
| **Integration tests** | **None.** No automated tests exist against a live Supabase instance; RLS/query behavior is entirely unverified by automation. |
| **Manual QA** | The six core V1 business workflows (builder onboarding, project hierarchy, buyer → handover, owner activation, branding → Flutter payload, communications) have been manually walked through and recorded as passing against the demo/mock data layer — see `docs/releases/V1_WORKFLOW_VALIDATION.md`. Several steps are explicitly marked blocked or contract-only rather than fully passing (e.g. Digital Handover's SQL apply step). |
| **Performance** | Lazy loading, route guards, code splitting, and pagination patterns are all in place and passing spot-checks. Bundle size is over its warning budget (~2.2MB vs. 1.45MB). No load/stress testing has been performed. |
| **Accessibility** | Semantic headings/labels are present as a baseline; no formal WCAG 2.1 AA audit has been completed. Status is explicitly "partial / pending," not "verified." |

---

## 11. Current Sprint

The active branch is `feature/auth-02-login-loading-fix`.

**What's being worked on:** a login-hang defect where authentication succeeds (a Supabase session is established) but the UI never redirects and the login button spins indefinitely. Root cause has been identified: a prior Super Admin access fix (AUTH-01) caused organization-context resolution to re-publish a `contextChanged` event on every successful platform resolve, and because the platform operator lookup is cached after its first hit, this created a tight synchronous re-entry loop in `AuthorizationService` that never let the original navigation-blocking resolution finish. The fix has been applied in code and is documented as **"FIXED (code) — verify Super Admin login manually"** — manual verification of the Super Admin login path is the specific remaining step before this item is closed.

This sprint is explicitly scoped narrowly: no auth redesign, no routing redesign, no RBAC redesign, and no database/Flutter changes are in scope for this fix.

---

## 12. Next Milestones

**Immediate**
- Manually verify the AUTH-02 fix (current sprint, §11).
- Write the missing DS-05 and DS-06 implementation reports to close the documentation gap identified in §6/§9.
- Begin UI-REBIRTH-01 Phase 0 (Foundation Integrity): enforce the existing spacing/color token system across feature styles, fix the inert workspace switcher, remove or fix decorative sidebar nesting.

**Short term**
- UI-REBIRTH-01 Phase 1 (Demo-Critical Fixes): unify the Detail-page pattern (real tabs for Projects, a real Stage Tracker for Handovers), collapse the dashboard to four zones, enforce one primary action per toolbar.
- Write the Units (B05) and Owner Assignment (B06) SQL migrations — the single highest-leverage backend fix, since it unblocks the Digital Handover schema and several other dependent items.

**Medium term**
- Apply Row-Level Security to every table currently missing it (B08–B12 — 21 of 27 tables).
- Replace in-memory/mock repositories with live Supabase-backed implementations across Projects, Units, Owners, Branding, Communications, Subscriptions, and Platform modules.
- Stand up environment-isolated Supabase projects (development/QA/staging/production currently share one project).
- UI-REBIRTH-01 Phases 2–3 (Systemic Consistency; Power and Delight — command palette, Analytics surface).

**Long term**
- Live payment provider integration, invoice PDF generation, error tracking, deeper support-user RBAC, automated E2E test suite, formal accessibility audit.
- UI-REBIRTH-01 Phase 4 (White-label Readiness) and the broader white-label/multi-tenant SaaS vision, plus the reserved future Tenant Portal, Vendor Portal, and full Public Website build-out.

---

## 13. Risks

**Current risks**
- Demo success being mistaken for production readiness, given the UI is ~94% complete while live data wiring is ~35% complete (V1 Executive Report's own named risk).
- A shared Supabase project across all environment tiers risking QA/production data collision.
- The gap between what the architecture series formally decided (Nx monorepo, three apps) and what's actually built (one Angular CLI app) causing confusion if not kept visible to future contributors.

**Blockers**
- **Missing Units (B05) and Owner Assignment (B06) SQL** blocks the Digital Handover schema from applying cleanly on a clean database — the single most concrete technical blocker in the project right now.
- **Incomplete RLS (21 of 27 tables)** blocks any responsible decision to move those tables' data access from mock to live.

**Open decisions**
- Whether to retroactively number and document the four "modernize X UI/UX" commits as formal DS phases, or track them as a separate category.
- Whether Units/Owner Assignment SQL should be built fresh in this repository or explicitly aligned to the Flutter side's own Schema V2 effort (an open question carried since the earliest architecture documents, per `PROJECT_OVERVIEW.md` §7).
- Whether a distinct "Customer" concept is ever needed apart from "Owner" (§8) — not currently decided either way.

**Pending approvals**
- Most A-series/NG-series foundational architecture documents remain formally un-approved (Draft status) despite implementation having proceeded — per this project's own AI Development Guide, no further code should be generated *from* those documents' unapproved specifics without treating that gap as live, even though it hasn't blocked work to date.
- No architecture document has yet formally approved moving any module from mock/in-memory to live Supabase-backed data — this should be treated as requiring an explicit approval step, not an implicit "just wire it up" task.

---

## 14. Release Readiness

| | |
|---|---|
| **Overall completion (feature/UI)** | ~94% |
| **Overall completion (production readiness)** | **62/100** |
| **Formal recommendation** | **NO-GO for commercial production launch. GO for a controlled stakeholder/sales demo.** |

**Critical blockers to production:**
1. Missing Units (B05) and Owner Assignment (B06) SQL schema.
2. Row-Level Security missing on 21 of 27 tables (every table from the Digital Handover migration onward).
3. Business data layer still in-memory/mock across nearly every module — no multi-user, persistent production operation is possible today.
4. Shared Supabase project across all environment tiers — no environment isolation.

**Recommended next steps, in order:**
1. Close the current AUTH-02 sprint with manual verification.
2. Write the Units and Owner Assignment SQL migrations — this single item unblocks the largest number of downstream Critical/High findings.
3. Apply RLS to every table currently missing it, in the same pass as wiring each module's live Supabase repository (per the V1 Security Audit's own recommendation — do these two together, not RLS-then-later-live-wiring, to avoid a window where data looks isolated in the UI but isn't at the database layer).
4. Split environment-tier Supabase projects before any non-demo traffic is considered.
5. Continue the UI-REBIRTH-01 roadmap in parallel — it does not block production readiness, but it is the difference between "functionally complete" and the premium, enterprise-credible experience this platform is being built to deliver.
