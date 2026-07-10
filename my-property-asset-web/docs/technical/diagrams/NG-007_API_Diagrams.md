# NG-007 — API Diagrams

**Companion to:** [`../NG-007_API_Data_Access_Architecture.md`](../NG-007_API_Data_Access_Architecture.md)

---

## 1. API Architecture

```mermaid
flowchart TB
    Feature[Feature / Service Layer] --> Repository["Repository\n(one per Information Domain,\nexcludes ID-13 entirely)"]
    Repository --> SupabaseClient[Supabase Client — one per app]
    SupabaseClient --> PostgREST[PostgREST / RPC]
    PostgREST --> RLS[(Row Level Security)]
    RLS --> Postgres[(PostgreSQL)]
```

---

## 2. Repository Architecture

```mermaid
flowchart LR
    subgraph "shared-data-access (Shared, NG-003)"
        R1[Organizations Repository]
        R2[Projects Repository]
        R3[Units Repository]
        R4[Documents Repository]
        R5[Invitations Repository]
        R6[Notifications Repository]
    end
    NoRepo["NO Properties / Loans / Expenses\nrepository exists — ever"]

    style NoRepo fill:#eee,stroke-dasharray: 5 5
```

---

## 3. Data Flow Diagram

```mermaid
sequenceDiagram
    participant Component
    participant Service as Feature Service (Signal owner)
    participant Repo as Repository
    participant Supabase

    Component->>Service: Read signal (sync)
    alt Cache empty/invalidated
        Service->>Repo: getProjects(orgId, filters, pagination)
        Repo->>Supabase: Query (narrow select, server-side filter/sort)
        Supabase-->>Repo: Raw rows
        Repo->>Repo: Map to shared-models Read DTO
        Repo-->>Service: Domain-shaped result
        Service->>Service: toSignal(), cache keyed by Organization ID
    end
    Service-->>Component: Current value (reactive)
```

---

## 4. Repository Relationships

```mermaid
flowchart TB
    OrgRepo[Organizations Repository] --> ProjectRepo[Projects Repository]
    ProjectRepo --> UnitRepo[Units Repository]
    UnitRepo --> DocRepo[Documents Repository]
    UnitRepo --> InviteRepo[Invitations Repository]
    InviteRepo -.on acceptance, hands off to.-> OwnerApp["Owner Mobile App's own data layer\n(entirely outside this workspace)"]
```

---

## 5. Supabase Integration

```mermaid
flowchart LR
    App[Application] --> Client["One Supabase Client\n(Core, injected via shared-auth)"]
    Client --> Repos["Repositories only\n(Nx tag matrix enforced)"]
    Repos -.NEVER injected into.-x Feature
    Repos -.NEVER injected into.-x Component
```

---

## 6. RPC Flow

```mermaid
flowchart TB
    Operation{Atomic, multi-step\noperation?}
    Operation -->|Yes| RPC["Call existing backend RPC\n(never compose raw calls to fake atomicity)"]
    Operation -->|No, single-table| DirectQuery[Direct Repository query/mutation]
    RPC --> Example["e.g. Support Access invocation\n(ADR-008 candidate — not designed here)"]
```

---

## 7. Realtime Flow

```mermaid
flowchart LR
    Reserved["Realtime: RESERVED, not active\n(backend confirms 0 tables configured)"] -.if ever adopted.-> Repo[Repository subscribes]
    Repo --> Boundary["toSignal()-equivalent boundary\n(same as any async source)"]
    Boundary --> FeatureSignal[Feature Signal]
```

---

## 8. Storage Flow

```mermaid
flowchart TB
    Upload[Upload] --> Repo[Repository wraps Storage call]
    Repo --> Bucket["Existing private bucket\n(reused backend convention)"]
    Bucket --> Path[Returns storage path, never public URL]
    Download[Download] --> SignedURL[Signed URL generated at read time, bounded expiry]
```

---

## 9. Error Flow

```mermaid
flowchart TB
    Error[Repository Error] --> Type{Type?}
    Type -->|Transient network| Retry[Limited retry with backoff]
    Type -->|RLS denial| NoRetry["NEVER retried — logged as\nSecurity Event (NG-006)"]
    Type -->|Validation rejection| Surface[Surfaced to user, not retried]
    Retry & NoRetry & Surface --> Infra[infra-error-handling, infra-logging]
```

---

## 10. Caching Flow

```mermaid
flowchart LR
    Repo["Repository\n(stateless — no cache)"] --> Service["Feature/Core Service\n(owns the Signal — the actual cache)"]
    Service --> CacheKey["Cache key includes Organization ID\n(NG-005/NG-001 §16, no exception)"]
    Mutation[Mutation succeeds] --> Invalidate[Service invalidates its own cache entry]
    Invalidate --> Service
```
