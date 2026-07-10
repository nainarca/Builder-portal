# Technical Debt Register — MyPropertyAsset Web Platform

**Companion to:** [`NG-014_Technical_Architecture_Review.md`](NG-014_Technical_Architecture_Review.md)
**Covers:** Gap Matrix, Risk Matrix.
**Method:** Every item below is drawn from `ARCHITECTURE_INDEX.md` §4's Known Open Items (the running register every prior document has contributed to) and each document's own Risks section — this register consolidates and classifies them, it does not discover new gaps this session, per this document's own no-redesign constraint.

## Gap Matrix

| # | Gap | Severity | Owner | Status |
|---|---|---|---|---|
| G-01 | A-006 (Functional Module Architecture) never written | **Critical** | Unowned — needs explicit business/technical stakeholder decision | Bridged by A-007 §2.1's provisional Working Module Reference; not resolved |
| G-02 | Builder Projects backend domain (Projects/Units) undesigned in the separate `my_property_asset` repository | **Critical** | Backend team/owner — outside this series' authority | Carried by 20 consecutive documents, mitigated by `infra-feature-flags` toggling |
| G-03 | `MASTER_CONTEXT.md` / `PROJECT_FACTS.md` referenced as mandatory reading by every prompt since A-001, never created | **High** | Whoever owns this initiative's prompt-authoring process | Confirmed absent again this session (10th+ consecutive verification) |
| G-04 | Zero of 23 documents (A-001–A-009, NG-000–NG-013) carry human Approval status | **Critical** | A human stakeholder — `AI_DEVELOPMENT_GUIDE.md`'s own rule, not this series' choice to waive | Unresolved since A-009 first found 0/8; now 0/23 |
| G-05 | ADR-008 (Support Access invocation RPC) — policy decided (ADR-012), invocation workflow never designed | **Medium** (narrowly scoped to one feature) | Unowned — passed over by NG-007 (named it, declined to design), NG-011, NG-012, NG-013 | Open since A-008 |
| G-06 | First Super Admin account provisioning mechanism unspecified | **Medium** (one-time bootstrap, not a recurring code path) | Unowned | Surfaced by NG-006, not picked up since |
| G-07 | `organization_type` discriminator — undecided | **Low** | Whichever future document designs the Builder Handover Portal's data model | Narrowed (not closed) since A-002 |
| G-08 | SA-08, SA-10, BA-13 screens with no backing A-003A story | **Low** | Unowned | Flagged at A-004, not backfilled |
| G-09 | "Owners" and "Profile" navigation items with no backing A-004 screen | **Low** | Unowned | Flagged at A-005, not backfilled |
| G-10 | A-series filename convention inconsistency (hyphenated vs. underscore) | **Cosmetic** | Whoever approves the series | Flagged at A-003, never unilaterally corrected (by design — avoids breaking an external reference) |

**No gap above is newly discovered by this review** — every one was surfaced, at the time it was found, by the document whose scope first encountered it. This review's contribution is consolidation and severity classification, not discovery.

## Risk Matrix

| # | Risk | Likelihood | Impact | Mitigation in place |
|---|---|---|---|---|
| R-01 | Implementation begins against Draft (unapproved) documents, later requiring rework once formal approval surfaces a disagreement | Medium | High | `AI_DEVELOPMENT_GUIDE.md`'s hard Approval gate — Cursor AI is architecturally forbidden from generating code against Draft documents, so this risk is process-preventable, not merely documented |
| R-02 | Builder Projects backend domain is commissioned with a shape that doesn't match the 20 documents' worth of assumptions built around it | Medium | High | `infra-feature-flags` isolates every dependent surface; no Builder-Projects-dependent code ships un-gated |
| R-03 | A-006 is never written, and the Working Module Reference's provisional module boundaries turn out to not match real functional requirements once implementation begins | Medium | Medium | Every downstream document has kept the reference explicitly labeled provisional — a future correction is a scoped update to boundaries already isolated as Feature libraries (NG-003), not a platform-wide rewrite |
| R-04 | PrimeNG's theming API does not support fully runtime-supplied tokens the way `THEME_ARCHITECTURE.md` §28 assumes | Low–Medium | Medium | Explicitly named as an assumption in NG-013 §12/13, not asserted as verified fact — flagged for confirmation at implementation start, not silently relied upon |
| R-05 | Five-environment-tier model (NG-011) is operationally/financially heavier than the team implementing this can sustain | Medium | Low–Medium | NG-011 §11 states this explicitly as the "enterprise-grade target," not a claim that fewer tiers would be architecturally wrong — a known, reasoned trade-off |
| R-06 | Numeric commitments with no implementation track record (90%/85% coverage floors, WCAG 2.1 AA, Core Web Vitals targets, performance budgets) prove miscalibrated once real code exists | Medium | Low | Each was set with explicit reasoning (industry-standard thresholds, not invented numbers) and each document flagged its own targets as revisit-candidates once evidence exists |
| R-07 | Support Access (A-008 §7) cannot actually be built until ADR-008's invocation workflow is designed, delaying a feature multiple downstream documents already assume exists | Low (narrowly scoped) | Medium | Isolated to one feature; does not block any other Feature library given `FEATURE_BOUNDARIES.md`'s isolation rules |
| R-08 | The external backend repository's schema (only 3/10 Business Domain items specified, per its own Stage 4 Review) does not evolve in step with this series' assumptions about it | Medium | High | Every document referencing backend schema state cites the verified status note (`ARCHITECTURE_INDEX.md` §0) rather than assuming completeness — the risk is real but not silently carried |

**Highest-severity, highest-likelihood combination**: R-01 and R-02, both already carrying real, named mitigations (the Approval gate and `infra-feature-flags`, respectively) — this is a register of managed risk, not unmanaged risk, which is itself part of this review's readiness finding.
