# Error Classification — MyPropertyAsset Web Platform

**Companion to:** [`NG-010_Error_Handling_Logging_Architecture.md`](NG-010_Error_Handling_Logging_Architecture.md)
**Covers:** Error Classification Strategy, Error Severity Levels, Error Categories.

## 2. Error Classification Strategy

Every error in this platform is classified along **two independent axes** — never a single flat "error type" enum, because *how severe* an error is and *what kind* of error it is answer different questions and drive different responses (severity drives logging/alerting behavior, §3; category drives user messaging and retry behavior, §4). An error is always tagged with exactly one value from each axis before it leaves the layer that detected it — `infra-error-handling` (NG-003 `LIBRARY_CATALOG.md` #24) is where this tagging happens, never left to be inferred later by whatever code eventually catches it.

## 3. Error Severity Levels

| Severity | Meaning | Example | Response |
|---|---|---|---|
| **Critical** | Platform-wide or security-relevant — Organization isolation breach, Restricted-Financial access attempt, authentication system failure | An RLS denial pattern suggesting a probing attempt; a Support Access grant used outside its audited scope | Immediate alert (`OBSERVABILITY_STRATEGY.md` §27), always logged at `error` level regardless of environment |
| **High** | A user-facing operation failed and cannot be silently retried | A mutation rejected by validation the client should have caught; an RPC failure mid-operation | Logged at `error`, surfaced to the user (§ User-Friendly Error Strategy, `ERROR_HANDLING_GUIDELINES.md` §5) |
| **Medium** | A recoverable anomaly — the platform continues functioning, but something didn't go as expected | A transient network failure that a retry resolves; a stale cache entry triggering a re-fetch | Logged at `warn`, usually invisible to the user unless the retry itself fails |
| **Low** | Expected, routine friction — not a defect | A form validation error the user can immediately correct; an empty search result | Logged at `info` or not logged at all (routine UX, not an operational signal) — restated from `TECHNICAL_STANDARDS.md` §12's log-level table, now mapped onto severity explicitly |

**Severity is orthogonal to category** — a Critical-severity error can be an Authorization-category error (an RLS denial pattern) just as easily as an Authentication-category one (a compromised-looking session); the table above gives one example per row for concreteness, not an exhaustive mapping.

## 4. Error Categories

| Category | Scope | Primary source |
|---|---|---|
| **Validation** | Client- or server-rejected input | Form validation (`DATA_TRANSFORMATION.md` §20's boundary restated), backend constraint rejection |
| **Authentication** | Identity cannot be established or confirmed | Session expiry, invalid credentials, token refresh failure (`AUTHENTICATION_ARCHITECTURE.md`) |
| **Authorization** | Identity is known, but the action is not permitted | RLS denial, RBAC-gated route/feature/menu blocked (`AUTHORIZATION_ARCHITECTURE.md` §19–22) |
| **Network** | The request never reached or returned from the backend | Connectivity loss, DNS failure, request timeout (`ERROR_HANDLING_GUIDELINES.md` §13, §15) |
| **Data** | The backend responded, but the response itself is the problem | An RPC's business-rule rejection, a constraint violation surfaced as a structured error rather than a network failure |
| **System** | The Angular application itself is in an unexpected state | An unhandled exception in application code, a rendering failure — the category the Global Error Handler (`ERROR_HANDLING_GUIDELINES.md` §7) exists specifically to catch |

**No category exists for Restricted-Financial-domain errors specifically** — because no code path touching Properties, Loans, or Expenses exists anywhere in this workspace (NG-003, NG-007, NG-008's three prior restatements of the same exclusion), there is no error this taxonomy needs to classify for that domain. An Authorization-category "Restricted-Financial access attempt" is only possible as a *malicious or malformed request the backend RLS layer rejects* — this platform's own code never constructs one, consistent with every prior document.
