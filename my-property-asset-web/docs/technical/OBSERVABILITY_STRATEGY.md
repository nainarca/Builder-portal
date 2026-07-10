# Observability Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-010_Error_Handling_Logging_Architecture.md`](NG-010_Error_Handling_Logging_Architecture.md)
**Covers:** Error Notification Strategy, Monitoring & Alert Integration, Error Analytics, Privacy & Sensitive Data Handling, Incident Investigation Workflow, Future Observability Strategy.

## 26. Error Notification Strategy

A **toast/banner-level notification** (transient, non-blocking) is used for Medium-severity errors a user can continue past (`ERROR_CLASSIFICATION.md` §3) — a failed background refresh, a retried-and-recovered network blip. A **blocking, in-context message** (inline form error, `ERROR_HANDLING_GUIDELINES.md` §9, or a full-section error state) is used for High-severity errors that prevent the user's current action from completing. **Critical-severity errors never rely on a toast alone** — a Security Event (`LOGGING_STANDARDS.md` §24) or a platform-wide failure surfaces through a persistent, harder-to-dismiss UI treatment, since a toast that auto-dismisses in a few seconds is the wrong mechanism for something the user needs to actually register. This document specifies the *strategy* (which severity gets which treatment); it does not design the notification component itself (`shared-ui`'s job, out of this document's scope per its own Quality Rules).

## 27. Monitoring & Alert Integration

| Signal | Alerting posture |
|---|---|
| Critical-severity Security Event (§24 in `LOGGING_STANDARDS.md`) | Immediate alert — this is the one category of event this document treats as always alert-worthy, no threshold or batching |
| High-severity error rate exceeding a threshold | Alert — a single High-severity error is expected occasionally (users make mistakes, networks blip); a *rate* exceeding normal is the actual signal |
| Performance KPI regression (`MONITORING_KPIS.md` §30) | Alert, routed through the same monitoring integration NG-009 already named, not a separate pipeline |
| Support Access invocation (`TECHNICAL_STANDARDS.md` §13) | Always independently visible — restated once more because it is the one rule in this area that must never quietly become "just check the log later" |

This document names the integration points; it does not select a specific alerting/on-call tool (PagerDuty, Opsgenie, or equivalent) — an implementation choice, consistent with `MONITORING_KPIS.md` §29's own deferral of RUM tooling.

## 28. Error Analytics

Aggregated, anonymized error-frequency analysis (which Error Category, `ERROR_CLASSIFICATION.md` §4, occurs most often; which Feature produces the most High-severity errors) is a legitimate use of the structured log data (`LOGGING_STANDARDS.md` §19) once it exists — this document reserves that this is a valid downstream use, but does not design a specific analytics dashboard or pipeline, since no prior document has scoped one as a product requirement. **Error analytics never aggregates or displays Restricted-Financial content** (§29) — an analytics view showing "Category: Data, Feature: X, Count: N" is safe; one showing the actual rejected payload of a Restricted-Financial-adjacent request would not be, and this document draws that line explicitly rather than leaving it to an analytics tool's default behavior.

## 29. Privacy & Sensitive Data Handling

**This is the fourth restatement of this platform's single most-repeated absolute rule, now at the logging/observability layer**: NG-003 excluded Restricted-Financial data at the library layer, NG-007 at the repository/data-access layer, NG-008 at the physical folder layer, and now — **no log entry, error payload, correlation-ID-linked trace, analytics aggregate, or monitoring alert may ever contain Restricted-Financial content (A-007 ID-13), under any circumstance, in any environment, even transiently** (`TECHNICAL_STANDARDS.md` §14's "even transiently" language, restated at full strength here because logging is exactly the kind of secondary channel where a rule enforced at the primary data-access layer could otherwise leak through unnoticed — a stack trace that happens to include a variable's value, or a request payload logged for debugging, are the concrete mechanisms this rule exists to close off).

Beyond Restricted-Financial specifically: Organization-Confidential data (A-008's classification tier below Restricted-Financial) is logged only as much as operationally necessary (an Organization ID for correlation, §22 — never a full record's contents) and Personally Identifiable Information (user email, name) is logged only where the log's purpose genuinely requires it (an audit entry recording *who* performed an action, §23) — never included in a Performance Event (§25) or a routine `info` log where it serves no purpose.

## 30. Incident Investigation Workflow

1. An alert (§27) or a user-reported issue provides a starting point — ideally a correlation ID (§22 in `LOGGING_STANDARDS.md`), either from the alert itself or from what the user was shown (§5's "reference this if contacting support").
2. The correlation ID is used to retrieve every log entry across every layer (client-observed error, interceptor-classified error, Repository-level technical error) tagged with it — this is the concrete payoff of §22's "thread through every log entry" requirement.
3. Severity and category (`ERROR_CLASSIFICATION.md`) narrow whether this was a Critical Security Event (escalate per §27's posture) or an ordinary operational failure (standard triage).
4. **Investigation never requires reconstructing Restricted-Financial content to diagnose an error about it** — because no such content is ever logged (§29), an investigation into an error adjacent to that domain is scoped to *that the boundary held*, not to *what was in the request*, by construction.

This document specifies the workflow; it does not select or design the tooling (a log-aggregation/search product) that would make step 2 practical at scale — an implementation choice.

## 31. Future Observability Strategy

- **Distributed tracing** (beyond correlation IDs) is not adopted now — no prior document has identified a genuinely multi-service backend topology this platform's own Repository-to-Supabase call pattern would need it for; correlation IDs (§22) are sufficient for this platform's actual architecture (a single Angular client talking to a single Supabase backend per environment).
- **Realtime observability** (if `REALTIME_STRATEGY.md` §14's reserved Realtime subscription mechanism is ever activated) would extend this document's Performance Event logging (§25) to subscription lifecycle events (opened/closed/error) — reserved as a natural extension point, not designed further, consistent with Realtime's own reserved status everywhere else in this series.
- **Client-side session replay or heatmap tooling** is not adopted — not requested by any prior document, and would raise the same Privacy & Sensitive Data Handling questions (§29) at a much larger surface area (an entire recorded session vs. a structured log entry) that this document is not prepared to resolve without an explicit business requirement first.
