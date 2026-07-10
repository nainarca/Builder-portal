# Error Handling Guidelines — MyPropertyAsset Web Platform

**Companion to:** [`NG-010_Error_Handling_Logging_Architecture.md`](NG-010_Error_Handling_Logging_Architecture.md)
**Covers:** Error Handling Principles, User-Friendly Error Strategy, Technical Error Strategy, Global Error Handling Architecture, Feature-Level Error Handling, Form Validation Error Strategy, API Error Handling Strategy, Authentication Error Handling, Authorization Error Handling, Network Failure Handling, Offline Error Strategy, Timeout Handling, Retry Strategy.

## 1. Error Handling Principles

- **Centralized, not scattered** (`TECHNICAL_STANDARDS.md` §11, restated as the governing principle for this entire document): a global error handler plus an HTTP/Supabase-client interceptor are the only two entry points where an unhandled error is caught generically — no local, inconsistent `try/catch` per component swallowing an error silently.
- **User-facing and technical errors are distinct objects, not the same error formatted two ways** — a technical error (stack trace, Supabase error code) is logged (`LOGGING_STANDARDS.md`); a user-facing error (§5 below) is a separate, deliberately-authored message. Converting one to the other is `infra-error-handling`'s explicit job, never left to whichever component happens to catch the error first.
- **An error is handled at the layer that has enough context to handle it correctly, never reflexively at the layer that first observes it.** A Repository observes a network failure first but doesn't know whether the calling Feature can offer a retry button — it propagates (`DATA_TRANSFORMATION.md` §22, restated) rather than guessing.

## 5. User-Friendly Error Strategy

Every user-facing error message is authored, not templated from a raw backend error — a Supabase/Postgres error string is never shown to a user (`TECHNICAL_STANDARDS.md` §11, restated). Messages are written per Error Category (`ERROR_CLASSIFICATION.md` §4), not per individual error code, so a new backend error code automatically gets a sensible category-level message rather than falling through to a blank or broken display. A user-facing message never includes a stack trace, correlation ID as a raw string dumped in the UI (a correlation ID may be *shown* for support purposes, §22, but formatted as "reference this if contacting support," not as debug output), or any Organization-Confidential or Restricted-Financial content.

## 6. Technical Error Strategy

The full technical error (stack trace, Supabase error code, correlation ID, request context) is captured and logged (`LOGGING_STANDARDS.md`) but never rendered in the UI outside a development-only diagnostic surface (if one exists at all — not designed by this document). This is the concrete implementation of §1's "distinct objects" principle: a technical error and its corresponding user-facing message are two different pieces of data, produced together at the same handling point, routed to two different destinations (log vs. screen).

## 7. Global Error Handling Architecture

Two catch points, each application-wide (one instance per application, per `APPLICATION_ARCHITECTURE.md`'s per-app Core composition):

| Catch point | Catches | Cannot catch |
|---|---|---|
| **Global Error Handler** (Angular's `ErrorHandler` extension point) | Unhandled synchronous exceptions and unhandled Promise rejections anywhere in application code — the System category (`ERROR_CLASSIFICATION.md` §4)'s primary source | Errors already handled locally by a Feature's own explicit error handling (§8) — by design, not a gap |
| **HTTP/Supabase-client interceptor** | Every Repository-originated network/RPC/RLS response (`REPOSITORY_ARCHITECTURE.md` §1, `DATA_TRANSFORMATION.md` §22's error-propagation flow terminates here) | Errors that never reach the network layer (client-side validation, §9) |

Both catch points classify the error (`ERROR_CLASSIFICATION.md`), log it (`LOGGING_STANDARDS.md`), and — critically — **do not automatically decide the user-facing response themselves**; they hand the classified error to whichever Feature/Core service is positioned to decide the correct user experience (a toast, an inline message, a full-page error state), consistent with §1's "handled at the layer with enough context" principle.

## 8. Feature-Level Error Handling

A Feature's own service layer (`REPOSITORY_ARCHITECTURE.md` §3) is where a classified error becomes a specific user experience — deciding whether a failed Project creation shows an inline form error (§9) or a toast, because only the Feature knows what the user was trying to do. Feature-level handling never re-implements classification or logging (§7's catch points already did that) — it consumes the already-classified error and produces UI response only.

## 9. Form Validation Error Strategy

Client-side validation errors (immediate, Low-severity, `ERROR_CLASSIFICATION.md` §3) are shown inline, at the field level, the moment they occur — no round trip needed, since these never reach the network layer at all. Server-side validation rejections (a backend constraint the client-side check didn't anticipate, `DATA_TRANSFORMATION.md` §20 restated) arrive through the API Error Handling path (§10) and are mapped back onto the same form's field-level display where possible, or a form-level message where the rejection doesn't correspond to one specific field — never silently dropped or shown only in a log a user can't see.

## 10. API Error Handling Strategy

Every Repository/RPC error is already tagged with severity and category (`ERROR_CLASSIFICATION.md`) by the interceptor (§7) before a Feature ever sees it. This document adds no new API-error mechanism beyond what `RPC_STRATEGY.md` §23 and `DATA_TRANSFORMATION.md` §22 already established — it names those two documents' rules as the concrete instance of this document's general Global/Feature split (§7–8): the interceptor is where `RPC_STRATEGY.md` §23's retry table (§16 below) and `DATA_TRANSFORMATION.md` §22's RLS-denial tagging actually execute.

## 11. Authentication Error Handling

An Authentication-category error (`ERROR_CLASSIFICATION.md` §4) — expired session, failed token refresh — triggers `AUTHENTICATION_ARCHITECTURE.md` §7's already-defined reactive re-resolution (detected on next navigation or next RLS denial, never proactively polled) rather than a new mechanism. This document's addition: an Authentication-category error is always at least High severity (§3) — an authentication failure is never treated as routine, because it gates every other Context in the identity model (ADR-012) from resolving at all.

## 12. Authorization Error Handling

An Authorization-category error (an RLS denial, or a route/feature/menu-level RBAC block, `AUTHORIZATION_ARCHITECTURE.md` §19–22) is tagged **Critical severity specifically when it represents an actual backend RLS denial** (a real enforcement boundary was hit) versus **Medium severity when it's a route-guard-level UX block that never reached the network** (the user simply couldn't see a menu item they lack permission for) — this distinction matters because only the former is the security-relevant event `TECHNICAL_STANDARDS.md` §11/§14 requires to "fail loudly," while the latter is ordinary, expected UX gating that doesn't need the same alerting weight.

## 13. Network Failure Handling

A request that never reaches the backend (DNS failure, connection refused, offline) is classified as Network-category, Medium severity by default (escalated to High if the failed request was a mutation the user is actively waiting on). The user sees a distinct "connection problem" message, never the same generic error shown for a Data-category or Authorization-category failure — conflating them would tell the user to do the wrong thing (retrying a network failure is sensible; retrying an RLS denial is not, `RPC_STRATEGY.md` §23 restated).

## 14. Offline Error Strategy

Consistent with `REALTIME_STRATEGY.md` §24's intentionally minimal Offline Strategy: this platform detects the offline state and shows it clearly (a Network-category error, §13, at Medium severity, platform-wide rather than per-request once detected) — it does not queue mutations for later replay. An offline-triggered error is therefore always framed to the user as "reconnect and retry," never as "this was saved and will sync later," because the latter would misrepresent a capability this platform deliberately does not build (per `REALTIME_STRATEGY.md` §24's own explicit scope boundary).

## 15. Timeout Handling

A request exceeding a defined timeout is treated identically to a Network-category failure (§13) from the user's perspective — the distinction (timeout vs. connection failure) is preserved in the technical error (§6) for diagnostic purposes but collapsed into the same "connection problem" user-facing message, since the correct user action (retry) is the same either way. Timeout duration itself is an implementation parameter, not an architectural decision this document makes.

## 16. Retry Strategy

Restated from `RPC_STRATEGY.md` §23, the single source of truth for this table — not redefined here:

| Error type | Retry behavior |
|---|---|
| Transient network failure | Limited automatic retry with backoff, at the Repository/interceptor boundary |
| Authorization denial (RLS rejection) | Never automatically retried — logged as a Critical-severity Security Event (§12 above, `LOGGING_STANDARDS.md` §24) |
| Validation rejection | Not retried — surfaced to the user as a correctable error (§9) |

This document's one addition: **a manual retry action, offered to the user**, is distinct from *automatic* retry and is always available for Network-category failures (§13) regardless of whether automatic retry already ran and gave up — the user is never left at a dead end for a category of error that is, by definition, potentially transient.
