# Versioning Policy — MyPropertyAsset Web Platform

**Companion to:** [`NG-011_Build_Release_Deployment_Architecture.md`](NG-011_Build_Release_Deployment_Architecture.md)
**Covers:** Versioning Strategy, Semantic Versioning Policy.
**Note:** `ADR-007` (Semantic Versioning, decided at NG-000) already established SemVer as this platform's versioning scheme for platform releases and shared libraries, distinct from the A-series/NG-series document-versioning convention. This document does not redecide ADR-007 — it elaborates the *policy* NG-000 didn't need to specify at governance level: what actually triggers each version segment, and how versioning works across an Nx monorepo with multiple independently-deployable applications and shared libraries.

## 5. Versioning Strategy

Two versioning scopes, tracked independently:

| Scope | Versioned as | Bumped when |
|---|---|---|
| **Platform release** (what's promoted through `ENVIRONMENT_STRATEGY.md`'s pipeline and deployed to Production) | One SemVer per application, per `ADR-009`'s independent-application model — Public Website, Super Admin, and Builder Portal each carry their own version, since they deploy independently and a Super Admin-only change has no reason to bump Public Website's version | Every Production deployment of that application |
| **Shared library** (`shared-*`, `theme-*`, `util-*`, `infra-*`) | Independent SemVer per library, per `REPOSITORY_STANDARDS.md` §26's backward-compatibility rule | A breaking public-API change (major), a backward-compatible addition (minor), or a fix (patch) — never bumped just because an application consuming it shipped |

This is an **independent versioning scheme, not a fixed/lockstep one** (the Nx monorepo terminology for "every project shares one version number") — a fixed scheme would force Public Website's version to bump every time Builder Portal ships, which contradicts the whole point of `ADR-009`'s independent-application boundary. Independent versioning is the only choice consistent with a decision this series already made, not a new judgment call this document is making from scratch.

## 6. Semantic Versioning Policy

Standard SemVer (`MAJOR.MINOR.PATCH`), with this platform's own concrete trigger definitions:

| Segment | Triggered by (application) | Triggered by (shared library) |
|---|---|---|
| **MAJOR** | A change requiring users to be informed or retrained (a materially different workflow) — rare, and always accompanied by a deliberate release note, not inferred automatically | A breaking change to the library's public API (`PROJECT_ORGANIZATION.md` §9's declared export surface) — requires a documented migration path (`REPOSITORY_STANDARDS.md` §26) |
| **MINOR** | A new feature ships (a new route, a new capability) | A backward-compatible addition to the public API |
| **PATCH** | A bug fix, a visual/copy correction, a dependency update with no behavior change | A backward-compatible internal fix |

**No Restricted-Financial-adjacent versioning exception exists** — a version bump never needs special handling because it touches Properties/Loans/Expenses, since no code path in this workspace does (NG-003, NG-007, NG-008, NG-010's four prior restatements of the same exclusion) — this document confirms there is nothing to add on that front, rather than leaving the question unaddressed.

A version is assigned once, at the moment an artifact is built (`BUILD_STRATEGY.md` §24), and never changes as that artifact promotes through environment tiers — the version identifies the artifact, not the environment it currently happens to be deployed to (a build sitting in UAT and the "same" build now in Production carry the identical version number, by construction, since it is the identical artifact).
