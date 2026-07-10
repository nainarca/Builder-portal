# Repository Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-000_Web_Platform_Technical_Governance.md`](NG-000_Web_Platform_Technical_Governance.md)
**Covers:** Versioning, Source Control, Branching, Release Strategy, Backward Compatibility, Deprecation, Feature Toggles, Technical Debt, Architectural Decision Process, Repository Standards, Documentation Governance.

## 6. Versioning Strategy

Semantic Versioning (MAJOR.MINOR.PATCH) for the platform release and any shared library. Documentation versioning (A-series/NG-series) keeps its own already-established convention (Major.Minor, per A-001 §Versioning Rules) — the two are related but not merged into one scheme, since a documentation revision and a shipped code release are different events.

## 7. Source Control Standards

Git. Conventional commit messages (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Protected main branch — no direct commits, no force-push. Every merge is a pull request with at least one independent review (`CODING_STANDARDS.md` §30).

## 8. Branching Strategy

**Trunk-based development with short-lived feature branches** — chosen over GitFlow's long-lived develop/release branches, because a SaaS platform aiming for continuous delivery benefits from minimizing divergence between branches, and this platform's own governance (feature toggles, §28) already provides the mechanism GitFlow's release branches exist to substitute for. A feature branch merges to main via PR once it passes every quality gate (`QUALITY_GATES.md`); it does not wait for a separate release branch to be cut.

## 25. Release Strategy

Continuous delivery to staging on every merge to main; gated, deliberate promotion to production (not automatic) — reflecting this platform's own multi-tenant, financially-sensitive nature (A-008's Restricted-Financial rule) rather than a generic "ship fast" default.

## 26. Backward Compatibility Rules

Mirrors the business-documentation series' own discipline (every A-001–A-009 document is additive, never silently rewriting an approved predecessor) applied to code: no breaking change to a shared library or public interface without a major version bump and a documented migration path. The existing Flutter Owner Mobile App and its backend contract are **never** broken by web-platform work — this is non-negotiable given A-001 §8's framing of the mobile app as an existing, external, production client this initiative must not disrupt.

## 27. Deprecation Policy

Deprecated code/interfaces are marked explicitly (`@deprecated` with a reason and a replacement pointer), given a minimum notice period before removal, and tracked until actually removed — not left marked indefinitely.

## 28. Feature Toggle Strategy

Feature toggles gate incomplete or backend-dependent features — **this is the concrete mechanism that operationalizes A-009's split verdict**: Builder Portal screens whose backing Builder Projects domain doesn't exist yet can be built and merged behind a toggle, developed incrementally, without either blocking the rest of NG-001 or shipping a feature that silently fails against a nonexistent backend. A toggle is removed once the feature is genuinely complete and the toggle itself becomes dead code otherwise — consistent with the Deprecation Policy above.

## 31. Technical Debt Policy

Technical debt is tracked explicitly in a register, not silently absorbed into "normal" backlog — the same "flag gaps explicitly, don't paper over them" discipline this entire document series has practiced from A-004 onward, now extended to code. Every deliberate shortcut (e.g., a feature shipped behind a toggle ahead of its backend dependency) is logged with its reason and its resolution condition.

## 32. Architectural Decision Process

Technical decisions are recorded as ADRs in `docs/adr/ADR_INDEX.md`, using the process already established by the business-architecture series — not a new or parallel process. A decision warrants an ADR when it is: (a) hard to reverse, (b) affects more than one module, or (c) deviates from a default this document sets. Routine implementation choices within an already-decided pattern do not need one.

## 33. Repository Standards

A single Angular workspace repository for the Web Platform (`my-property-asset-web`), kept separate from the existing Flutter repository (`my_property_asset`) — consistent with how A-001 already scoped this as an additive, non-disruptive initiative rather than a monorepo merger. Internal structure (Nx vs. plain Angular CLI workspace, library boundaries) is NG-002's job, not decided here.

## 34. Documentation Governance

The A-series (business architecture) and NG-series (technical architecture) numbered-document system, with its `ARCHITECTURE_INDEX.md` registry and `docs/adr/ADR_INDEX.md` ADR log, **is** this platform's permanent documentation governance model — formalized here, not reinvented. Every future document continues the same discipline already demonstrated across nine prior documents: explicit dependency declarations, pre-check verification, gap-flagging over silent assumption, and narrowing (not reversing) prior open questions.
