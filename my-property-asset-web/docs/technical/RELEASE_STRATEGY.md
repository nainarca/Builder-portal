# Release Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-011_Build_Release_Deployment_Architecture.md`](NG-011_Build_Release_Deployment_Architecture.md)
**Covers:** Release Principles, Git Branch Strategy (restated), Feature Branch Workflow, Release Branch Workflow, Hotfix Workflow, Release Validation, Release Approval Workflow.
**Note on ADR-006 consistency:** This document's Branch Strategy content does not redecide branching — `ADR-006` (Trunk-Based Development, decided at NG-000) already ruled out GitFlow-style long-lived develop/release branches, and nothing below reopens that. Where this prompt's own Define list asks for a "Release Branch Workflow" and "Hotfix Workflow," both are resolved as short-lived, release-time-only branches — a pattern fully compatible with trunk-based development, not a reintroduction of GitFlow.

## 2. Release Principles

- A release is **a specific, immutable build artifact** (`BUILD_STRATEGY.md` §24) that has completed the promotion pipeline (`ENVIRONMENT_STRATEGY.md` §7) and received explicit approval (§30 below) — never a branch, and never an ongoing state.
- Releases are frequent and small by default (a direct consequence of trunk-based development, ADR-006) — this platform does not batch multiple weeks of change into one release "event"; each mergeable, gate-passing change is a release candidate.
- **Gated promotion to Production is deliberate, not automatic** (`REPOSITORY_STANDARDS.md` §25, restated) — the one place this platform's release cadence is intentionally *not* as fast as trunk-based development alone would allow, because of the multi-tenant, Restricted-Financial-adjacent stakes A-008 already established.

## 4. Git Branch Strategy (restated)

`REPOSITORY_STANDARDS.md` §7–8 (NG-000), unchanged: trunk-based development, protected `main`, no direct commits, no force-push, every merge via reviewed PR. This document adds no new branch *type* to the platform's permanent structure — `main` remains the only long-lived branch.

## 13. Feature Branch Workflow

A short-lived branch cut from `main`, named per `REPOSITORY_STANDARDS.md` §7's conventional-commit-adjacent convention, merged back to `main` via PR once every `QUALITY_GATES.md` §35 gate passes. No feature branch outlives its own feature — a feature branch open long enough to need its own merges *from* `main` to stay current is a signal the feature should have been split smaller or gated behind a feature flag (`infra-feature-flags`, `REPOSITORY_STANDARDS.md` §28) rather than kept unmerged, consistent with ADR-006's whole rationale.

## 14. Release Branch Workflow

**Not a GitFlow-style long-lived branch.** A "release branch" in this platform's trunk-based model is a short-lived branch cut from `main` **only** if a release candidate already promoted to UAT (`ENVIRONMENT_STRATEGY.md` §10) needs a targeted fix without pulling in newer, unrelated commits that have since merged to `main` — e.g., a UAT-discovered defect needs fixing without also shipping an unrelated feature that merged to `main` the same week. The fix is committed to this branch, the branch is re-validated through the pipeline, and — critically — **the fix is also merged back to `main`** (never left to exist only on the release branch) before the branch is deleted. Most releases need no release branch at all: the common case is simply promoting `main` at a given commit through the pipeline directly. This resolves the prompt's own request for a Release Branch Workflow consistently with ADR-006, rather than either refusing the request or silently reintroducing GitFlow.

## 15. Hotfix Workflow

For a defect discovered in Production specifically (not caught by QA/UAT/Staging): a short-lived branch cut from the **currently-deployed Production commit/tag** (not from `main`, which may already contain unreleased work) — fixed, validated through an expedited but not abbreviated path (every `QUALITY_GATES.md` gate still applies; only the environment-tier *dwell time* is compressed, never the gates themselves), merged back to `main`, and deployed as its own release. A hotfix is rare by design — most defects are caught before Production by the five-tier pipeline (`ENVIRONMENT_STRATEGY.md` §7); a hotfix workflow existing at all is a safety net, not a routine path, and its frequency is itself a signal worth watching (an operational metric, not designed further here).

## 19. Release Validation

Beyond Build Validation (`BUILD_STRATEGY.md` §18, which gates whether an artifact is promotable at all), Release Validation is the tier-specific sign-off each environment requires before the *same* artifact advances (`ENVIRONMENT_STRATEGY.md` §9–12): QA's automated integration/RLS suite, UAT's human business sign-off, Staging's final production-shaped technical validation. An artifact that fails Release Validation at any tier does not advance and does not get "fixed in place" (artifact immutability, `BUILD_STRATEGY.md` §24) — the defect is fixed in a new commit, which produces a new artifact, which restarts the pipeline from QA.

## 30. Release Approval Workflow

1. Artifact passes Build Validation (`BUILD_STRATEGY.md` §18) — automatic, pipeline-enforced.
2. Artifact promotes through QA automatically (`ENVIRONMENT_STRATEGY.md` §9) — automatic, pipeline-enforced.
3. **UAT sign-off** (`ENVIRONMENT_STRATEGY.md` §10) — a named human decision, not a pipeline step; this is where `QUALITY_GATES.md` §36's white-label-on-a-real-Organization check and any other judgment-requiring verification happens.
4. **Staging validation** — final technical confirmation against Production-shaped configuration.
5. **Production approval** — a distinct, final human decision (never the same approval as step 3 reused) — this is the one step this document treats as non-delegable to automation under any circumstance, consistent with `REPOSITORY_STANDARDS.md` §25's "deliberate, not automatic" principle for Production specifically.

Every step in this workflow is logged (`LOGGING_STANDARDS.md` §23's Audit Logging Integration, restated — a release approval is itself an audit-relevant event, the same category of event as a Support Access invocation in terms of "must be durably recorded, not just implied by the deploy having happened").
