# Build Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-011_Build_Release_Deployment_Architecture.md`](NG-011_Build_Release_Deployment_Architecture.md)
**Covers:** Build Principles, CI Pipeline Architecture, Build Validation, Build Artifact Strategy, Static Asset Strategy.

## 1. Build Principles

- **Build once, promote many** (ADR-017, main document §14) — a single build artifact per application per release candidate is produced exactly once and promoted, unmodified, through every environment tier (`ENVIRONMENT_STRATEGY.md` §7–12). This is the single organizing principle behind every other decision in this document: it is what makes "tested in UAT" mean "the exact thing that reaches Production," not "something built the same way."
- Reproducible builds (`TECHNICAL_STANDARDS.md` §23, restated) — the same source commit produces a bit-for-bit-equivalent artifact regardless of which machine or pipeline run built it.
- Build-time type-checking enforced, never bypassed (`TECHNICAL_STANDARDS.md` §23, restated).

## 16. CI Pipeline Architecture

CI runs on every pull request (before merge) and once more on every merge to `main` (producing the actual promotable artifact) — two distinct runs with different purposes: the PR-time run gates the merge itself (`QUALITY_GATES.md` §35's full checklist: lint, type-check, unit tests, RLS/RBAC integration tests, security scan, ADR-for-new-pattern check, review approval), while the merge-time run additionally produces and fingerprints the artifact (§24) that will carry through every environment tier without being rebuilt. Each application (`ADR-009`'s three independent apps) builds independently — a Public Website-only change does not trigger a Super Admin or Builder Portal build, consistent with Nx's own affected-project detection (the concrete mechanism, not redesigned here, that makes independent-application CI practical at the tooling level).

## 18. Build Validation

A build is only considered valid — eligible to become a promotable artifact — once it has passed every `QUALITY_GATES.md` §35 gate **and** the Performance Budget check (`BUNDLE_STRATEGY.md` §2, NG-009) for its application. A build that passes functionally but exceeds its bundle budget is still a failed build, not a passed build with a warning — restating `BUNDLE_STRATEGY.md` §2's "CI-enforced, not aspirational" language specifically in the context of what "valid" means for promotion purposes.

## 24. Build Artifact Strategy

**Every artifact is immutable and uniquely identified** (by the version, §5 in `VERSIONING_POLICY.md`, and the source commit SHA) — once built, its contents never change; a "fix" is a new build with a new version, never a patch applied to an existing artifact in place. This is what makes Build Once, Promote Many (§1) trustworthy: if an artifact could be modified after QA validated it, QA's validation would no longer say anything reliable about what reaches Production.

**Consequence for configuration** (elaborated fully in `ENVIRONMENT_STRATEGY.md` §21): because the same artifact must run correctly against QA, UAT, Staging, and Production's different Supabase projects, any configuration value that differs per environment (most importantly, the API endpoint) **cannot be baked into the artifact at build time** — it must be resolved at runtime, from an environment-specific value the deployment target itself provides (e.g., a small, deployment-injected configuration file or endpoint fetched before the Angular application bootstraps proper). This is a **deliberate amendment to `WORKSPACE_GUIDE.md` §14** (NG-002), which had placed API endpoint resolution in the build-time tier — flagged here explicitly, not silently changed, because Build Once/Promote Many is the newer, more specific decision and API-endpoint-at-build-time is incompatible with it. `WORKSPACE_GUIDE.md` §14's broader two-tier model (build-time vs. runtime configuration) is otherwise unchanged; only the API endpoint's own tier assignment moves.

## 25. Static Asset Strategy

Restated from `BUNDLE_STRATEGY.md` §8/§20 (NG-009), now confirmed consistent with Build Once/Promote Many: content-hashed static assets are part of the one immutable artifact (§24) and are promoted, unmodified, alongside the application code they belong to — an asset is never re-optimized or re-hashed between environment tiers, since doing so would itself violate artifact immutability.
