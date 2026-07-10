# NG-010 — Error Architecture Diagrams

**Companion to:** [`../NG-010_Error_Handling_Logging_Architecture.md`](../NG-010_Error_Handling_Logging_Architecture.md)

---

## 1. Global Error Flow

```mermaid
flowchart TB
    Sync["Unhandled sync exception /\nPromise rejection"] --> GEH["Global Error Handler"]
    Network["Repository / RPC / RLS response"] --> Interceptor["HTTP/Supabase-client Interceptor"]
    GEH --> Classify["Classify: Severity + Category\n(ERROR_CLASSIFICATION.md)"]
    Interceptor --> Classify
    Classify --> Log["Log (LOGGING_STANDARDS.md)"]
    Classify --> Handoff["Hand off to Feature/Core service"]
    Handoff --> UX["Feature decides UX response\n(ERROR_HANDLING_GUIDELINES.md §8)"]
```

---

## 2. Error Classification Model

```mermaid
flowchart LR
    Error["Any error"] --> Severity["Severity axis\nCritical / High / Medium / Low"]
    Error --> Category["Category axis\nValidation / Authentication / Authorization /\nNetwork / Data / System"]
    Severity -.orthogonal.-> Category
    Category --> NoRestricted["No category for Restricted-Financial —\nno code path exists to produce one"]
    style NoRestricted fill:#eee,stroke-dasharray: 5 5
```

---

## 3. Logging Architecture

```mermaid
flowchart TB
    Client["Browser (client)"] -->|debug/info: console only, dev| DevConsole["Dev console"]
    Client -->|warn/error, audit, security| InfraLogging["infra-logging\n(single implementation)"]
    InfraLogging --> ServerBackend["Server-side logging backend\n(vendor TBD)"]
    ServerBackend --> Audit["Audit-tagged entries\n(longer retention)"]
    ServerBackend --> Security["Security Events\n(always error-level)"]
    ServerBackend --> Perf["Performance Events"]
```

---

## 4. Error Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Feature
    participant Repo as Repository
    participant Interceptor
    participant Logging as infra-logging

    User->>Feature: Triggers operation
    Feature->>Repo: Call
    Repo->>Interceptor: Request fails
    Interceptor->>Interceptor: Classify (severity + category)
    Interceptor->>Logging: Log (correlation ID threaded)
    Interceptor-->>Feature: Classified error
    Feature->>Feature: Decide UX (toast / inline / blocking)
    Feature-->>User: User-friendly message (never raw error)
```

---

## 5. API Error Flow

```mermaid
flowchart TB
    APICall["Repository call"] --> Result{Result?}
    Result -->|Transient network| Retry["Retry with backoff"]
    Result -->|RLS denial| NoRetry["Never retried — Critical Security Event"]
    Result -->|Validation rejection| Surface["Surface to user, not retried"]
    Retry -->|Still failing| ManualRetry["Manual retry offered to user"]
```

---

## 6. Authentication Error Flow

```mermaid
flowchart TB
    AuthError["Authentication-category error"] --> Detect["Detected reactively —\nnext navigation or next RLS denial\n(never proactively polled)"]
    Detect --> Reresolve["Re-resolve Authentication Context\nfresh, as a new login would"]
    Reresolve --> Downstream["Organization Context + RBAC\nre-resolve after"]
    AuthError --> Severity["Always at least High severity —\ngates every other Context"]
```

---

## 7. Monitoring Integration

```mermaid
flowchart LR
    CriticalSecurity["Critical Security Event"] --> Immediate["Immediate alert"]
    HighRate["High-severity error rate\nexceeds threshold"] --> Alert["Alert"]
    PerfRegression["Performance KPI regression\n(NG-009)"] --> Alert
    SupportAccess["Support Access invocation"] --> AlwaysVisible["Always independently visible"]
    Alert --> OnCall["Alerting/on-call tool (vendor TBD)"]
    Immediate --> OnCall
```

---

## 8. Incident Response Flow

```mermaid
flowchart TB
    Trigger["Alert or user report"] --> CorrelationID["Retrieve correlation ID"]
    CorrelationID --> Gather["Gather every log entry\nacross every layer with that ID"]
    Gather --> Triage{"Critical Security Event?"}
    Triage -->|Yes| Escalate["Escalate per Monitoring posture"]
    Triage -->|No| Standard["Standard triage"]
    Escalate --> Resolve["Resolve"]
    Standard --> Resolve
    Resolve --> NoRestrictedContent["Never requires reconstructing\nRestricted-Financial content — none was ever logged"]
```
