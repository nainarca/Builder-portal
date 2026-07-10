# Environment Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-011_Build_Release_Deployment_Architecture.md`](NG-011_Build_Release_Deployment_Architecture.md)
**Covers:** Environment Strategy, Development/QA/UAT/Staging/Production Environments, Configuration Management, Secrets Management, Environment Variables.
**Note on scope relative to NG-000:** `TECHNICAL_STANDARDS.md` §22 sketched "Dev → Staging → Production, each ideally backed by its own Supabase project" as a governance-level principle, not a final, exhaustive environment count — NG-000's own job was platform-wide governance, not the detailed environment design this prompt specifically tasks this document with. This document elaborates that sketch into five tiers, the same way NG-002 elaborated NG-001's flat six-library list into a fuller taxonomy without redesigning it (`LIBRARY_STRATEGY.md` §6). The elaboration is flagged here explicitly, not silently expanded.

## 7. Environment Strategy

Five environment tiers, each with its own Supabase project (`TECHNICAL_STANDARDS.md` §22's principle preserved exactly — only the tier count grows): **Development → QA → UAT → Staging → Production.** Promotion between tiers is one-directional and sequential — a change never skips a tier on its way to Production, and a tier is never used as a substitute for the one before it (QA sign-off does not imply UAT sign-off).

## 8. Development Environment

Not a deployed tier in the CI/CD promotion sense (§ below) — "Development" here means the ephemeral, per-feature-branch preview or local environment a developer works against before a PR merges (`RELEASE_STRATEGY.md` §13's Feature Branch Workflow). It exists to give a developer and a PR reviewer something to look at before code reaches `main`; it is not part of the promotion pipeline §7 describes, which begins once code merges.

## 9. QA Environment

The first environment in the actual promotion pipeline, and the one that receives **continuous, automatic deployment on every merge to `main`** — this is `REPOSITORY_STANDARDS.md` §25's "continuous delivery on every merge" principle, preserved exactly but now attached to QA rather than to what §25 called "staging" (a renaming this document makes explicit, not a contradiction: §25's underlying principle — automatic delivery immediately follows merge, deliberate gating happens later — is unchanged; only which tier carries the "immediately follows merge" role is refined, consistent with expanding three tiers to five). QA is where automated integration/RLS-boundary tests (`QUALITY_GATES.md` §24) run against a real, if non-production, Supabase project.

## 10. UAT Environment

**New in this document — not previously named by any prior technical document.** UAT (User Acceptance Testing) is a gated tier: promotion from QA to UAT requires the QA tier's automated validation (`BUILD_STRATEGY.md` §18–19) to have passed, and promotion out of UAT requires explicit business/stakeholder sign-off (`RELEASE_STRATEGY.md` §30's Release Approval Workflow) — this is the tier where a human, not a pipeline, decides a change is ready to move closer to Production. Consistent with `QUALITY_GATES.md` §36's Production Readiness Checklist already requiring white-label configuration to be "tested for at least one non-default Organization" — UAT is the natural tier where that specific check happens, since it requires human judgment about *whether it looks right*, not just whether it passed an automated assertion.

## 11. Staging Environment

The final pre-Production tier — configured as close to Production as this platform's architecture allows (same Supabase project *tier*, though never the same project as Production itself, preserving `TECHNICAL_STANDARDS.md` §22's "Organization-isolation testing never risks real tenant data" principle). Staging is where the exact build artifact (§24 in `BUILD_STRATEGY.md`) that will be promoted to Production is validated one final time — not a new build, the same immutable artifact UAT approved, now exercised against Production-shaped configuration.

## 12. Production Environment

Gated, deliberate promotion only — never automatic, regardless of how cleanly a change passed every prior tier (`REPOSITORY_STANDARDS.md` §25, restated: this reflects the platform's multi-tenant, Restricted-Financial-adjacent nature, not a generic caution default). Production promotion requires the Release Approval Workflow (`RELEASE_STRATEGY.md` §30) to have completed, and is the one tier where Deployment Validation (`DEPLOYMENT_STRATEGY.md` §20) and post-deployment Monitoring (`DEPLOYMENT_STRATEGY.md` §31) are non-negotiable, not merely recommended.

## 21. Configuration Management

Two tiers, restated from `WORKSPACE_GUIDE.md` §14 — **with one refinement this document makes explicit, not silently**: build-time/environment configuration (feature-flag defaults, environment identifiers) remains resolved at build time, but **API endpoint resolution moves from build-time to runtime**, a direct consequence of this document's Immutable Build Artifact decision (ADR-017, main document §14) — see `BUILD_STRATEGY.md` §24 for the full reasoning. Runtime/Organization-scoped configuration (white-label branding, per-Organization feature toggles) is unchanged from `WORKSPACE_GUIDE.md` §14 — still resolved during Shell bootstrap, never a build concern.

## 22. Secrets Management

Secrets (Supabase service-role keys where applicable, third-party API credentials) are never committed to source control (`TECHNICAL_STANDARDS.md` §21, restated) and are injected at the CI/CD pipeline level, scoped per environment tier — a QA-tier secret is never valid against the Staging or Production Supabase project, mirroring `TECHNICAL_STANDARDS.md` §22's per-environment Supabase project isolation at the credential level too. This document does not select a specific secrets-management tool (a vault product, cloud-provider secret manager) — an implementation choice.

## 23. Environment Variables

Per-environment variables are limited to what genuinely varies by tier and is not Organization-scoped data: the runtime-resolved API endpoint (§21), environment identifier (used only for internal logging/monitoring tagging, per `LOGGING_STANDARDS.md` §19 — never shown to end users, since a Production user has no reason to see "you are on prod"), and feature-flag defaults (`infra-feature-flags`, distinct from an individual Organization's own toggle state). Nothing Organization-specific is ever expressed as an environment variable — that would misrepresent per-Organization data as platform configuration, the same distinction `TECHNICAL_STANDARDS.md` §21 already drew.
