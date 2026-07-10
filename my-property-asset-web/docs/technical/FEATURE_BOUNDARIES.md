# Feature Boundaries — MyPropertyAsset Web Platform

**Companion to:** [`NG-001_Angular_Enterprise_Architecture.md`](NG-001_Angular_Enterprise_Architecture.md)
**Purpose:** Feature isolation rules and cross-feature communication patterns — the code-level enforcement of NG-000's Dependency Rules (`TECHNICAL_STANDARDS.md` §4).

## Feature Isolation

- No feature imports another feature's internals directly — not within an app, and never across apps.
- A feature may depend on `shared-*` and its app's Core services. It may never depend on a sibling feature.
- This mirrors, at the code level, the exact isolation A-004 §12 and A-005 §8 established at the business/navigation level: a Builder Portal user's Project & Unit Preparation feature has no business importing anything from the Reporting feature's internals, even though both exist in the same app.

## Module Responsibilities

| Feature | Responsibility (one line) |
|---|---|
| Marketing & Conversion (Public Website) | Present marketing content; capture leads/registrations; hand off to Super Admin via backend only |
| Builder Onboarding (Super Admin) | Review/decide Builder Registrations; provision Organizations on approval |
| Tenancy & Branding (Super Admin) | Manage Organization records and White-label configuration |
| Commercial (Super Admin) | Manage Subscriptions |
| Operations (Super Admin) | Platform Monitoring and Audit (the latter still gap-flagged per A-004/A-005/A-007/A-008 — this document doesn't resolve that gap, only reserves its architectural slot) |
| Project & Unit Preparation (Builder Portal) | Manage Projects, Units, Owner Assignment, Document Upload — **depends on the undesigned Builder Projects backend domain; this feature's boundary is architecturally sound but cannot be implemented until that dependency resolves (§17 Risks)** |
| Handover (Builder Portal) | Invitation lifecycle, handover tracking |
| Reporting (Builder Portal) | Aggregate views derived from Project/Unit/Handover data — never its own data store (A-007 ID-12's "derived, not stored" rule, restated as a code-level constraint: this feature must never cache a value it should instead compute from the owning feature's data) |
| Communication (all apps) | Notification display — the one feature type that legitimately exists once per app rather than being Builder/Super-Admin specific, since every app needs it |

## Cross Feature Communication

Three permitted channels, no others:

1. **Through Core services** — e.g., two features both needing Organization Context read it from the same Core-level service; they never pass it to each other directly.
2. **Through routing** — a feature completing its work navigates to a route owned by another feature (e.g., approving a Builder Registration navigates to that Organization's White-label configuration); this is a navigation event, not a code dependency.
3. **Through a Core-level event mechanism** — for same-app, cross-feature notification (e.g., the Communication feature reacting to an event another feature raised) — the event contract lives in `shared-models`, not in either feature, so neither feature depends on the other's internals to participate.

Any cross-feature need that doesn't fit one of these three channels is a signal the feature boundary itself may be wrong — a decision for a future NG document to revisit via ADR, not a reason to add a fourth, ad hoc channel.

## Dependency Direction (feature-level)

```
Feature → Core (app-level) → shared-* (workspace-level)
```
Never the reverse. A `shared-*` library that imports from a feature, or a Core service that imports from a feature, is a broken boundary regardless of how convenient it seems in the moment.
