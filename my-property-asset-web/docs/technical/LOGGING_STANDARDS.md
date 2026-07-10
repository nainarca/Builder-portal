# Logging Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-010_Error_Handling_Logging_Architecture.md`](NG-010_Error_Handling_Logging_Architecture.md)
**Covers:** Logging Principles, Log Levels, Structured Logging Standards, Client Logging, Server Logging Integration, Correlation ID Strategy, Audit Logging Integration, Security Event Logging, Performance Event Logging.

## 17. Logging Principles

- **Structured, not free-text** (`TECHNICAL_STANDARDS.md` §12, restated as this document's governing principle): every log entry is a structured object with consistent fields (§19), never a concatenated string a future reader has to parse.
- **`infra-logging` is the single implementation** — no Feature or Core library writes to the console or any logging backend directly; every log entry passes through this one library, the same "single implementation, never reimplemented per app" discipline `AUTHENTICATION_ARCHITECTURE.md`/`shared-rbac` already established for auth and RBAC.
- **No Restricted-Financial content ever appears in a log, at any level, in any environment** (`TECHNICAL_STANDARDS.md` §12, restated as an absolute rule — the same rule this series has now stated at the library layer, repository layer, folder layer, and error-classification layer). See §29 in `OBSERVABILITY_STRATEGY.md` for the full Privacy & Sensitive Data Handling treatment.

## 18. Log Levels

Restated from `TECHNICAL_STANDARDS.md` §12, now mapped explicitly onto `ERROR_CLASSIFICATION.md`'s severity axis so the two vocabularies never drift apart:

| Level | Used for | Corresponding severity |
|---|---|---|
| `debug` | Development-only diagnostic detail, never enabled in production builds | *(below Low — not error-classified at all)* |
| `info` | Normal operation, routine events worth a record but not a concern | Low |
| `warn` | Recoverable anomaly | Medium |
| `error` | A failure requiring attention | High, Critical |

## 19. Structured Logging Standards

Every log entry carries, at minimum: timestamp, level (§18), category (`ERROR_CLASSIFICATION.md` §4, where applicable), correlation ID (§22), the originating application (Public Website / Super Admin / Builder Portal), and the Organization ID **when the log entry is Organization-scoped and the entry itself is not the one place that ID must never appear** (i.e., Organization ID is standard structured metadata, not sensitive data — distinct from Restricted-Financial *content*, which is never logged regardless of structure, §17). No log entry is emitted as an unstructured string; a message field exists within the structured object, it is never the entire entry.

## 20. Client Logging

Client-side (browser) logging is deliberately minimal — `debug`/`info` level detail stays in the browser console during development only and is never shipped to a remote logging backend from the browser directly. Everything that needs to be durably logged (`warn`/`error`, and anything security- or audit-relevant) is sent to `infra-logging`'s backend integration (§21), not accumulated client-side, consistent with `TECHNICAL_STANDARDS.md` §20's stateless-application principle extended to logs specifically — the browser is not a durable log store.

## 21. Server Logging Integration

`infra-logging` forwards `warn`/`error`-level entries (and everything tagged Security Event, §24, or Audit Event, §23, regardless of level) to a server-side/external logging backend — this document names the requirement and the boundary (`infra-logging` is the only library that crosses it) but does not select a specific logging backend/APM vendor, consistent with `MONITORING_KPIS.md` §29's own deferral of RUM tooling selection to implementation.

## 22. Correlation ID Strategy

A correlation ID is generated once per user-initiated operation (a route navigation that triggers a fetch, a mutation, an RPC call) at the earliest point that operation begins, and threaded through every log entry produced while handling it — this is what makes `TECHNICAL_STANDARDS.md` §12's "tracing a request across layers" concrete: a single correlation ID lets a support investigation (§30) follow one user action from the Repository call, through any retry attempts (`ERROR_HANDLING_GUIDELINES.md` §16), to whatever error or success eventually resulted, without needing to correlate by timestamp guesswork. A correlation ID is safe to show to a user (§5, "reference this if contacting support") precisely because it is an opaque identifier, never derived from or containing any Organization-Confidential or Restricted-Financial value.

## 23. Audit Logging Integration

**Two distinct things share the word "audit" in this series, and this document is where the distinction is finally made explicit rather than left implicit:**

| | Business Audit Log (SA-10) | Audit Logging (this document) |
|---|---|---|
| What it is | A Super Admin-facing screen (A-004 SA-10) presenting an audit trail as a product feature | The logging-infrastructure mechanism that captures the events such a screen would display |
| Status | Still gap-flagged — no backing A-003A story (`ARCHITECTURE_INDEX.md` §4, carried since A-004) | Defined here, for the first time, as an architecture — the mechanism can exist and be correct independent of whether SA-10's screen ever gets built |
| Relationship | SA-10, if built, would be a `super-admin-audit` Feature (`SOURCE_TREE.md` §3) that *reads* the events this document's logging architecture *produces* | This document does not resolve SA-10's gap — it makes sure the underlying event trail is being captured regardless, so SA-10 has real data to read whenever it is eventually built |

Audit-relevant events (permission changes, Support Access invocations, Organization provisioning) are logged at `info` level or above but are additionally tagged `audit: true` in their structured entry (§19) — distinct from an ordinary `info` log, retained under a different (typically longer) retention policy, since an audit trail's value is specifically its durability over time.

## 24. Security Event Logging

A Security Event is any log entry representing an actual or attempted boundary violation — an RLS denial (`ERROR_HANDLING_GUIDELINES.md` §12's Critical-severity Authorization case), a Support Access invocation (`TECHNICAL_STANDARDS.md` §13, restated: every invocation is independently monitored, not just recoverable from the audit log after the fact), or a Restricted-Financial access attempt of any kind. Every Security Event is logged at `error` level regardless of whether the underlying operation "succeeded" from the application's point of view (a correctly-denied RLS request is a successful *denial*, but it is still a Security Event worth recording) — this is the direct implementation of `TECHNICAL_STANDARDS.md` §11's "an attempt is itself worth knowing about."

## 25. Performance Event Logging

API/query latency and error rate (`MONITORING_KPIS.md` §29, restated) are logged as Performance Events — structured entries distinct from ordinary operational logs, carrying the correlation ID (§22) and enough timing detail to compute the p50/p95/p99 metrics `MONITORING_KPIS.md` §30 sets targets against. This document's addition beyond NG-009's own treatment: Performance Events are logged at `info` level (they are not errors), but are routed to the same server-side backend as `warn`/`error` entries (§21), not discarded client-side, since aggregate performance analysis (§28 in `OBSERVABILITY_STRATEGY.md`) requires the full data set, not just the failure cases.
