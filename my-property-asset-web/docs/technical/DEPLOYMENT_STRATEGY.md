# Deployment Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-011_Build_Release_Deployment_Architecture.md`](NG-011_Build_Release_Deployment_Architecture.md)
**Covers:** Deployment Principles, CD Pipeline Architecture, Deployment Validation, Database Migration Coordination, Rollback Strategy, Disaster Recovery Considerations, Blue/Green vs. Rolling Deployment, Monitoring After Deployment.

## 3. Deployment Principles

- A deployment **promotes an already-built, already-validated artifact** (`BUILD_STRATEGY.md` §24) to the next environment tier — a deployment step never builds, compiles, or modifies code; it only moves and activates a static bundle plus (for Public Website, `PERFORMANCE_STRATEGY.md` §19) its SSR server process.
- Deployment is stateless-application-consistent (`SCALABILITY_STRATEGY.md` §26, restated): deploying a new version never requires draining or migrating server-side session state, because none exists.
- Deployment to Production is always reversible within a bounded, known time (§27) — this is treated as a hard requirement, not an aspiration, given the platform's Restricted-Financial-adjacent stakes.

## 17. CD Pipeline Architecture

One CD pipeline per application (mirroring CI's per-application independence, `BUILD_STRATEGY.md` §16), each stage corresponding to one environment tier (`ENVIRONMENT_STRATEGY.md` §7): QA deployment is fully automatic on artifact promotion; UAT, Staging, and Production deployments each wait on their respective approval gate (`RELEASE_STRATEGY.md` §30) before executing. Public Website's pipeline has one additional concern the other two applications' pipelines don't — activating the SSR server process (`PERFORMANCE_STRATEGY.md` §19) alongside the static bundle, not just uploading files to a CDN origin.

## 20. Deployment Validation

A post-deployment smoke check runs automatically immediately after every deployment, at every tier — confirming the application loads, the Shell bootstraps (auth → Organization Context → RBAC → theme, `AUTHENTICATION_ARCHITECTURE.md` §4), and a basic RLS-backed read succeeds — before the deployment is considered complete. A failed smoke check at Production triggers immediate rollback (§27), automatically, not as a follow-up decision someone has to remember to make.

## 26. Database Migration Coordination

**The Angular workspace does not contain, run, or coordinate database migrations** — the backend schema lives in the separate `my_property_asset` repository (`REPOSITORY_STANDARDS.md` §33, restated), entirely outside this document's technical control. This document's actual responsibility is the *sequencing protocol* between the two: a web-platform deployment that depends on a backend schema change must never deploy ahead of that schema change being live in the target environment's Supabase project — a deploy-order dependency tracked as a release note/coordination step (a process discipline, not a technical mechanism this document can enforce from the Angular side alone). `REPOSITORY_STANDARDS.md` §26's rule — the existing Flutter Owner Mobile App's contract is never broken — extends here directly: a web-platform deployment must be backward-compatible with whatever schema version is currently live, never assume a schema change that hasn't shipped yet.

## 27. Rollback Strategy

**Because every deployment promotes an immutable, already-validated artifact (`BUILD_STRATEGY.md` §24), rollback is redeployment of the immediately-prior artifact — never a code revert-and-rebuild.** The prior artifact already passed every gate at every tier once; redeploying it is fast and low-risk by construction, which is the direct payoff of Build Once/Promote Many (ADR-017) applied to rollback specifically: a rollback is a deployment operation, not a development operation, and does not require CI to run again. Rollback is triggered automatically on a failed Deployment Validation smoke check (§20) at Production, or manually if a defect is discovered after the smoke check passed but before it's been caught another way.

## 28. Disaster Recovery Considerations

The Angular application layer's own disaster-recovery posture is simple by construction: because it is stateless and CDN-distributed (`SCALABILITY_STRATEGY.md` §26–27), recovering it means redeploying the last-known-good artifact (§27) to a new hosting target — there is no application-layer data to restore, since none is held outside Supabase. **Backend disaster recovery (database backups, point-in-time recovery) is entirely the responsibility of the separate backend repository/team** (`REPOSITORY_STANDARDS.md` §33, restated) — this document does not design it, only states the boundary plainly so it isn't mistaken for something this document was supposed to cover.

## 29. Blue/Green vs. Rolling Deployment Considerations

**New in this document — ADR-018, Blue/Green Deployment.** Rolling deployment (gradually replacing server instances one at a time) is a pattern designed for stateful server fleets — it has no real analogue for a stateless, CDN-distributed static bundle (`SCALABILITY_STRATEGY.md` §26), and applying it would add complexity without a corresponding benefit. Blue/Green — the new artifact is deployed fully, in parallel with the currently-live one, and traffic cuts over atomically once Deployment Validation (§20) passes — fits this platform's architecture directly: an atomic CDN/origin switch is a natural operation for static hosting, giving this platform instant, complete rollback (§27) as a side effect of the same mechanism, rather than a separate capability to build. See main document §14 for the full ADR statement.

## 31. Monitoring After Deployment

Immediately following a Production deployment, `MONITORING_KPIS.md` §29–30's Core Web Vitals and error-rate signals are watched at heightened attention for a defined post-deployment window (not a new metric — the same metrics NG-009/NG-010 already established, observed more closely right after a change most likely to introduce a regression). A statistically significant regression in that window is itself a rollback trigger (§27), extending the automatic-smoke-check trigger with a slightly longer, metric-based observation period — consistent with `OBSERVABILITY_STRATEGY.md` §27's existing alerting posture, not a new monitoring system.
