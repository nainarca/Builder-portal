---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-006 |
| **Document Name** | Authentication & Authorization Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000 through NG-005, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-series documents, especially A-008 (RBAC) and `PLATFORM_FOUNDATION_SPECIFICATION.md` (backend Organization/invitation model) |
| **Previous Document** | NG-005 Angular State Management Strategy |
| **Next Document** | NG-007 API & Data Access *(sequence shifted a fourth time — see Pre-Check Result)* |
| **Related ADR** | **ADR-002 (Supabase Authentication) — finally decided**; **ADR-012 (Three-Context Identity Model) — new**, see §16 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`AUTHENTICATION_ARCHITECTURE.md`](AUTHENTICATION_ARCHITECTURE.md), [`AUTHORIZATION_ARCHITECTURE.md`](AUTHORIZATION_ARCHITECTURE.md), [`SESSION_STRATEGY.md`](SESSION_STRATEGY.md), [`RBAC_INTEGRATION.md`](RBAC_INTEGRATION.md), [`diagrams/NG-006_Security_Diagrams.md`](diagrams/NG-006_Security_Diagrams.md).

---

# NG-006 — Authentication & Authorization Architecture

## Pre-Check Result

NG-000 (precedence) through NG-005 were read in full. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent. **Sequence shifted a fourth time**: NG-005 announced NG-006 = Folder Structure. This prompt is NG-006 titled Authentication & Authorization; per this prompt's own governing-reference-for list, Folder Structure now sits at NG-008 (behind API & Data Access, NG-007). **This is worth naming as a pattern now, not just another correction**: Folder Structure has been deferred in every single renumbering this series has had — four times running, always landing further out than the last announcement. This document does not attempt to fix that pattern (not this document's job), only records it plainly in `ARCHITECTURE_INDEX.md` §1 and flags it to the user directly, consistent with the standing intention noted after NG-005.

**This document does close two real, long-open items** rather than deferring further:
1. **ADR-002 (Supabase Authentication)** — named as an example ADR since this series' very first prompt (A-001), never picked up by any of the five prior NG documents because none of them was actually about authentication. This one is. Decided.
2. A genuine new decision about how identity composes at runtime, not previously stated by any document: **ADR-012, the three-context model** (Authentication / Organization / User, resolved separately, never collapsed into one object).

---

## 1. Executive Summary

NG-006 defines this platform's complete authentication and authorization architecture: Supabase Auth as the exclusive identity mechanism (ADR-002, finally decided), a three-layer security context (Authentication → Organization → User, ADR-012) that composes into one resolved permission-set Signal, and a single evaluation point (`shared-rbac`) that every route guard, menu check, and Feature gate reads from — never independently re-derives. Support Access (A-008 §7) is precisely located within this model as a temporary extension of Super Admin Context, not a role switch. No Angular guard, service, component, or RLS policy appears anywhere in this document.

## 2. Authentication Principles

See [`AUTHENTICATION_ARCHITECTURE.md`](AUTHENTICATION_ARCHITECTURE.md) §1 — Supabase Auth exclusively (ADR-002), the client never trusted for identity, Public Website genuinely stateless.

## 3. Authorization Principles

See [`AUTHORIZATION_ARCHITECTURE.md`](AUTHORIZATION_ARCHITECTURE.md) §2 — `PERMISSION_MATRIX.md` as the sole source of truth; this document defines the evaluation mechanism only.

## 4. Identity Architecture

See `AUTHENTICATION_ARCHITECTURE.md` §3–5, §8–9 — identity lifecycle per role, login/logout flows, token lifecycle, and the narrow Authentication Context Signal that deliberately excludes role/Organization detail. One genuine open question surfaced, not resolved: no prior document specifies how the platform's very first Super Admin account gets created.

## 5. Session Architecture

See `AUTHENTICATION_ARCHITECTURE.md` §6–7 and `SESSION_STRATEGY.md` § Security Context Lifecycle — session persistence via Supabase Auth's own mechanism, silent refresh as the common case, reactive (not polled) detection of mid-session Organization-membership changes.

## 6. Organization Context

See `AUTHORIZATION_ARCHITECTURE.md` §6, §11 — session-scoped and fixed for Builder Portal (ADR-011, restated), absent by default for Super Admin except via the explicit Support Access extension. Organization Switching is explicitly **not supported** for either role, for two different and not-to-be-conflated reasons.

## 7. Permission Resolution

See `AUTHORIZATION_ARCHITECTURE.md` §12–13 — the runtime algorithm composing Authentication + Organization + User Context into one resolved permission-set Signal, consumed identically everywhere it's needed.

## 8. RBAC Integration

See [`RBAC_INTEGRATION.md`](RBAC_INTEGRATION.md) in full — `shared-rbac` as the sole reader of `PERMISSION_MATRIX.md`, and the restatement, once more, of the one rule with no exception: no resolved permission set can ever include Restricted-Financial access.

## 9. Route Protection

See `AUTHORIZATION_ARCHITECTURE.md` §19–22 — the three-check sequence (Authentication → Organization → Permission), Feature-level defense in depth, menu authorization sharing the exact same Signal as route guards (never a second, driftable check), and the explicit restatement that Angular-side authorization is UX while Supabase RLS is enforcement.

## 10. Security Events

See `SESSION_STRATEGY.md` §23 — failed authorization, Support Access invocations, and session anomalies all flow to Infrastructure logging/error-handling, with Support Access specifically also destined for the Audit domain once it finally has a backing specification.

## 11. Future SSO Strategy

See `AUTHENTICATION_ARCHITECTURE.md` §25 — reserved, not designed; the three-context separation means SSO adoption would only ever touch Authentication Context, never Organization Context or RBAC.

## 12. Future MFA Strategy

See `AUTHENTICATION_ARCHITECTURE.md` §26 — same treatment, same reasoning.

## 13. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| No prior document specifies how the first Super Admin account is created | A genuine operational gap once implementation actually begins | Flagged explicitly (`AUTHENTICATION_ARCHITECTURE.md` §3) rather than silently assumed |
| The Audit domain (A-007 ID-06) remains unspecified across six documents now, and this document adds Security Event Flow as another thing that needs it | The gap's cost keeps compounding the longer it goes unaddressed | Restated, not re-solved — consistent with every prior document's treatment |
| Folder Structure has been deferred in four consecutive renumberings | Could indicate the prompt sequence is deprioritizing a document other NG documents structurally depend on (NG-002/003's tag matrix references a folder layout that doesn't formally exist yet) | Named explicitly as a pattern (§ Pre-Check Result) rather than silently accommodated a fifth time |
| Support Access's precise composition rule (extension, not switch) is now stated three times across three documents (A-008, NG-004 indirectly, this document) in slightly different words | Risk of subtle drift between restatements | This document's wording (§ Authorization Architecture §16) is intended as the canonical one going forward, since it's the first to state it as part of a formal identity model rather than a policy note |

## 14. Assumptions

- The backend's existing `organization_invitations` mechanism (`PLATFORM_FOUNDATION_SPECIFICATION.md`) is reused unchanged for Builder team member onboarding — not re-verified in this session, cited from prior established fact.
- Super Admin account provisioning happens through some out-of-band process this document cannot specify, since no prior document addresses it — treated as a known gap, not guessed at.

## 15. Constraints

No Angular guards, services, components, APIs, SQL, Supabase policies, or folder structure appear anywhere in this document or its companions (explicit Quality Rule). Every authorization rule here is a runtime-resolution concept, never an RLS policy or a guard implementation.

## 16. Architecture Decisions

| Decision | Status | Reasoning |
|---|---|---|
| **Supabase Auth as the exclusive authentication mechanism** | **ADR-002 — Accepted** (finally decided, open since A-001) | No parallel system; already the de facto behavior of every prior document, formally closed here because this is the document actually about authentication |
| **Three-context identity model: Authentication Context, Organization Context, and User Context resolved as separate, independently-composed Signals — never one monolithic "auth state"** | **ADR-012 — Accepted** | Enables Public Visitor Context to be a clean "all layers absent" state rather than a special case; isolates future SSO/MFA work to Authentication Context alone; makes Support Access precisely describable as an *extension* of one layer (Super Admin's permission set) rather than requiring a special-cased second identity |
| Support Access is an extension of Super Admin Context, never a role switch or impersonation | Clarification within ADR-012's scope, not a separate ADR | `AUTHORIZATION_ARCHITECTURE.md` §16 |

## 17. Implementation Readiness Checklist

- [ ] Three-context model (ADR-012) understood as binding for NG-007 (API & Data Access) and NG-008 (Folder Structure) — neither should introduce a monolithic auth-state alternative
- [ ] Support Access's "extension, not switch" framing (§16) treated as canonical, superseding any looser prior phrasing
- [ ] The unresolved "first Super Admin account" bootstrap question flagged for whoever owns actual provisioning, not silently assumed solved
- [ ] Route/Feature/Menu authorization confirmed as reading one shared Permission Set Signal, never three independently-maintained checks

## 18. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-006 entry and the fourth NG-series slot correction, with the deferral pattern named explicitly.

## 19. Updated ADR List

**Required and completed.** ADR-002 (Supabase Authentication) and ADR-012 (Three-Context Identity Model) are both Accepted, decided by this document.

## 20. Review Checklist

- [ ] ADR-012's three-context separation accepted, or redirected toward a simpler unified auth-state model
- [ ] Support Access's identity-model placement (extension of Super Admin Context) confirmed as accurate to actual intent
- [ ] The Super Admin bootstrap gap acknowledged, with an owner assigned if this is genuinely unresolved
- [ ] Folder Structure's four-time deferral pattern acknowledged by whoever authors these prompts, not just by this index

## 21. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Security Architect (mandatory for this document specifically)
- [ ] Reviewed by IAM Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-007 (API & Data Access) authorized to begin
