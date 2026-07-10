# NG-011 — Build, Release & Deployment Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-011 |
| Name | Build, Release & Deployment Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-010, A-001–A-009 |
| Previous Document | NG-010 — Error Handling & Logging Architecture |
| Next Document | NG-012 — Testing Strategy |
| Governing reference for | ADR-017 (Immutable Build Artifact Strategy), ADR-018 (Blue/Green Deployment), NG-012 Testing Strategy, NG-013 UI Design System Integration, NG-014 Technical Architecture Review & Implementation Readiness, Future DevOps implementation, Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-010 in full (including `REPOSITORY_STANDARDS.md` §6–8, §25–34, `TECHNICAL_STANDARDS.md` §21–23, `QUALITY_GATES.md`, `WORKSPACE_GUIDE.md` §13–14, `AI_DEVELOPMENT_GUIDE.md`, `SCALABILITY_STRATEGY.md`, `MONITORING_KPIS.md`, `OBSERVABILITY_STRATEGY.md`), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` re-verified absent — noted once, per established practice.

**Renumbering: none.** NG-010's own "governing reference for" list announced NG-011 as "Build & Deployment Architecture"; this prompt's title, "Build, **Release** & Deployment Architecture," adds "Release" explicitly — a title expansion consistent with the pattern already seen at NG-014 (expanded from "Technical Architecture Review" to include "& Implementation Readiness" at NG-010). Not a renumbering, noted in `ARCHITECTURE_INDEX.md` §1 as a title refinement. The governing-reference-for list (NG-012, NG-013, NG-014) matches NG-010's announcement exactly.

**Two real conflicts identified and resolved — both flagged explicitly, neither silently absorbed:**

1. **Environment tier count.** `TECHNICAL_STANDARDS.md` §22 (NG-000) sketched three tiers — Dev → Staging → Production. This prompt's own Define list requests five (Development, QA, UAT, Staging, Production). Resolved as an **elaboration, not a contradiction**: NG-000 is platform-wide governance, stated at a sketch level; this document is the one whose specific job is environment strategy in full detail, the same relationship NG-002 had to NG-001's flat library list. `ENVIRONMENT_STRATEGY.md` expands to five tiers and explicitly re-attaches `REPOSITORY_STANDARDS.md` §25's "continuous delivery on every merge" language to QA (renamed from what §25 called "staging") rather than leaving that principle orphaned by the expansion.

2. **Release/Hotfix branch requests vs. ADR-006.** `ADR-006` (NG-000) already decided trunk-based development, explicitly ruling out GitFlow-style long-lived develop/release branches. This prompt's Define list asks for a "Release Branch Workflow" and "Hotfix Workflow" as if such branches were a given. Resolved by defining both as **short-lived, release-time-only branches** — fully compatible with trunk-based development, not a reintroduction of GitFlow — per `RELEASE_STRATEGY.md` §14–15. This is the same kind of resolution NG-003 applied to a differently-shaped conflict (the Property library refusal): here, unlike that case, the request is satisfiable without violating the standing rule, so it is fulfilled, reshaped to fit ADR-006, rather than refused.

**One correction made to a prior document, flagged explicitly.** `WORKSPACE_GUIDE.md` §14 (NG-002) placed API endpoint resolution in the build-time configuration tier. This document's Build Once/Promote Many decision (ADR-017) is incompatible with that — the same artifact must run correctly against every environment's distinct Supabase project, which requires the API endpoint to resolve at runtime instead. `BUILD_STRATEGY.md` §24 states this amendment explicitly, scoped narrowly (only the API endpoint's tier assignment moves; `WORKSPACE_GUIDE.md` §14's broader two-tier model is otherwise unchanged) — consistent with this series' practice of correcting a prior document's specific claim when a later, more specific document's job requires it (the precedent: NG-004's Routing/Folder-Structure slot correction).

**No Restricted-Financial conflict** — restated briefly in `VERSIONING_POLICY.md` §6 only because "no special versioning handling is needed" is itself worth confirming explicitly, not because this document's scope (build/release/deploy mechanics) otherwise touches domain content.

---

## 1. Executive Summary

NG-011 defines how code becomes a running, promotable, rollback-safe release — the layer between NG-000's governance principles and an actual DevOps pipeline. Its organizing decision is **ADR-017: Build Once, Promote Many** — one immutable artifact per application, built exactly once, carried unmodified through five environment tiers (Development, QA, UAT, Staging, Production) to Production. A second decision, **ADR-018: Blue/Green Deployment**, follows directly from this platform's stateless, CDN-distributed architecture (NG-009): atomic cutover, not rolling replacement, giving instant rollback as a side effect of the same mechanism. Five companion files carry the detail: `BUILD_STRATEGY.md`, `RELEASE_STRATEGY.md`, `DEPLOYMENT_STRATEGY.md`, `VERSIONING_POLICY.md`, and `ENVIRONMENT_STRATEGY.md`.

## 2. Build Strategy

See `BUILD_STRATEGY.md` §1, §16, §18, §24–25. Reproducible, immutable, once-per-release-candidate builds; CI runs at PR-time (gates the merge) and merge-time (produces the promotable artifact); a build exceeding its performance budget (NG-009) is a failed build.

## 3. Release Strategy

See `RELEASE_STRATEGY.md` §2, §4, §13–15, §19, §30. A release is an artifact, not a branch or an event; trunk-based branching (ADR-006) unchanged; Feature/Release/Hotfix workflows all resolved as short-lived branches; a five-step Release Approval Workflow culminating in a Production decision that is never automated.

## 4. Deployment Strategy

See `DEPLOYMENT_STRATEGY.md` §3, §17, §20, §26–29, §31. Deployment promotes, never builds; per-application CD pipelines; automatic post-deployment smoke validation; database migrations remain the backend repository's own responsibility, with a stated cross-repo sequencing discipline; Blue/Green cutover (ADR-018); heightened post-deployment monitoring drawing on NG-009/NG-010's existing metrics.

## 5. Environment Strategy

See `ENVIRONMENT_STRATEGY.md` in full. Five tiers — Development (pre-merge, not part of the promotion pipeline), QA (automatic on merge), UAT (human sign-off), Staging (production-shaped final validation), Production (gated) — each with its own Supabase project, elaborating `TECHNICAL_STANDARDS.md` §22's three-tier sketch.

## 6. Versioning Policy

See `VERSIONING_POLICY.md` in full. Independent SemVer per application and per shared library (never fixed/lockstep), elaborating `ADR-007`'s already-decided scheme with concrete MAJOR/MINOR/PATCH trigger definitions; a version is assigned once, at build time, and never changes as the artifact promotes.

## 7. CI/CD Architecture

See `BUILD_STRATEGY.md` §16 and `DEPLOYMENT_STRATEGY.md` §17 together — CI (build + validate) and CD (promote + deploy) as two connected but distinct pipelines, one per application, mirroring `ADR-009`'s independent-application boundary at the tooling level.

## 8. Configuration Strategy

See `ENVIRONMENT_STRATEGY.md` §21–23. Build-time configuration remains build-time except for the one deliberate, flagged amendment (API endpoint → runtime, `BUILD_STRATEGY.md` §24); secrets injected per environment tier at the pipeline level, never committed; environment variables limited to genuinely tier-varying, non-Organization-scoped values.

## 9. Rollback Strategy

See `DEPLOYMENT_STRATEGY.md` §27–28. Rollback is redeployment of the immediately-prior immutable artifact — never a revert-and-rebuild — triggered automatically on a failed smoke check or a post-deployment metric regression, or manually otherwise; disaster recovery at the application layer is redeployment to a new hosting target, since no application-layer data exists to restore.

## 10. Operational Readiness

Every mechanism in this document assumes `QUALITY_GATES.md` §36's Production Readiness Checklist as the final gate before any artifact reaches Production approval (§30 in `RELEASE_STRATEGY.md`) — this document does not restate that checklist, it makes the pipeline that enforces it concrete. Consistent with that checklist's own honest finding (no feature has a traceable origin in an *approved*, not merely Draft, business-architecture document today), this document's pipeline is architecturally complete but not yet operationally exercised — see §11 Risks.

## 11. Risks

- **Builder Projects backend dependency is now carried by 18 consecutive documents** (adds NG-011 — the build/release/deployment pipeline this document specifies applies uniformly to the still-undesigned Projects/Units backend domain's eventual releases, gated as always by `infra-feature-flags`).
- **The runtime API-endpoint-resolution amendment (`BUILD_STRATEGY.md` §24) has not been implemented or tested** — it is architecturally sound and necessary for Build Once/Promote Many to hold, but like every mechanism in this document, it is unvalidated against real infrastructure.
- **Five environment tiers, each with its own Supabase project, is a real operational and cost commitment** — this document elaborates NG-000's three-tier sketch because the prompt's own scope calls for it, but a smaller team/budget reality could reasonably collapse QA and UAT into one tier; this document states the fuller model as the enterprise-grade target, not as a claim that fewer tiers would be architecturally wrong.
- **No CI/CD vendor, hosting provider, or CDN is selected** (`BUILD_STRATEGY.md`, `DEPLOYMENT_STRATEGY.md` throughout) — every mechanism here is vendor-agnostic by design, per this document's own Quality Rules, but that means real implementation risk is deferred, not eliminated.

## 12. Assumptions

- A CI/CD platform capable of per-application pipelines, artifact promotion (not rebuild-per-stage), and Blue/Green-style atomic cutover is available — not selected by this document, assumed obtainable.
- Five Supabase projects (one per environment tier) can be provisioned and kept isolated from each other, consistent with `TECHNICAL_STANDARDS.md` §22's Organization-isolation-testing principle.

## 13. Constraints

- No GitHub Actions YAML, Dockerfile, Azure DevOps pipeline, shell script, Terraform, or Kubernetes manifest is generated by this document (Quality Rules, restated) — every mechanism here is a specification for a future implementation to satisfy.
- This document does not select a CI/CD vendor, hosting provider, CDN, secrets-management tool, or SSR hosting mechanism — each is named as a category of decision correctly deferred to implementation.

## 14. Architecture Decisions

**ADR-017: Immutable Build Artifact Strategy (Build Once, Promote Many) — Accepted.** One build artifact per application, per release candidate, built exactly once and promoted unmodified through QA, UAT, Staging, and Production. Chosen because it is the only strategy that makes "validated in UAT" mean "the exact thing that reaches Production," eliminating an entire class of environment-drift defects a rebuild-per-tier strategy risks. Requires — and this document states the requirement explicitly rather than leaving it implicit — that any per-environment-varying configuration value (most importantly the API endpoint) resolve at runtime, not build time, amending `WORKSPACE_GUIDE.md` §14's prior build-time placement of that one value. See `BUILD_STRATEGY.md` §1, §24.

**ADR-018: Blue/Green Deployment — Accepted.** Every deployment to every gated tier deploys the new artifact fully, in parallel with the currently-live version, and cuts traffic over atomically once Deployment Validation (`DEPLOYMENT_STRATEGY.md` §20) passes. Chosen over rolling deployment because rolling deployment is a pattern for stateful server fleets this platform's stateless, CDN-distributed architecture (`SCALABILITY_STRATEGY.md` §26–27, NG-009) does not have — applying it would add complexity with no corresponding benefit, while Blue/Green gives this platform instant, complete rollback (`DEPLOYMENT_STRATEGY.md` §27) as a natural side effect of the same cutover mechanism, not a separately-built capability. See `DEPLOYMENT_STRATEGY.md` §29.

## 15. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Build principles, CI pipeline, build/artifact validation defined | ✅ §2, `BUILD_STRATEGY.md` |
| Release principles, branch workflows (consistent with ADR-006), approval workflow defined | ✅ §3, `RELEASE_STRATEGY.md` |
| Deployment principles, CD pipeline, rollback, disaster recovery, Blue/Green defined | ✅ §4, §9, `DEPLOYMENT_STRATEGY.md` |
| Five-tier environment strategy defined, reconciled with NG-000's sketch | ✅ §5, `ENVIRONMENT_STRATEGY.md` |
| Versioning policy elaborated, consistent with ADR-007 | ✅ §6, `VERSIONING_POLICY.md` |
| Configuration/secrets/environment variables defined, WORKSPACE_GUIDE.md §14 amendment flagged | ✅ §8, `ENVIRONMENT_STRATEGY.md` §21–23, `BUILD_STRATEGY.md` §24 |
| ADR-017 and ADR-018 decided | ✅ §14 |
| Diagrams produced | ✅ `diagrams/NG-011_Deployment_Diagrams.md` (8 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (A-009's "not formally approved" finding still stands) |

## 16. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, repository-structure tree, Known Open Items, title-refinement note).

## 17. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-017 and ADR-018 added to Decided ADRs).

## 18. Review Checklist

| Item | Status |
|---|---|
| Every mechanism traced to an already-decided prior document or explicitly minted as a new ADR | ✅ |
| No pipeline YAML, Dockerfile, or infrastructure-as-code generated | ✅ |
| ADR-006 (Trunk-Based Development) consistency checked explicitly | ✅ (Pre-Check Result, `RELEASE_STRATEGY.md` header note) |
| WORKSPACE_GUIDE.md §14 amendment flagged, scoped narrowly, not silently changed | ✅ (`BUILD_STRATEGY.md` §24) |
| Environment tier expansion flagged as elaboration, not contradiction | ✅ (Pre-Check Result) |
| Restricted-Financial exclusion consistency checked | ✅ (`VERSIONING_POLICY.md` §6) |

## 19. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed (consistent with every prior NG document) |
| Ready to govern NG-012 onward | ✅ Structurally, per §15 |
