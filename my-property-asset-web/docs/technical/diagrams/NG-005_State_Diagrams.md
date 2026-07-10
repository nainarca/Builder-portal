# NG-005 — State Diagrams

**Companion to:** [`../NG-005_State_Management_Strategy.md`](../NG-005_State_Management_Strategy.md)

---

## 1. Application State Map

```mermaid
flowchart TB
    subgraph "Core (Global, Signal-based)"
        Auth[Auth Signal]
        OrgCtx[Organization Context Signal]
        RBAC[RBAC Permission Signal]
        Theme[Theme Signal]
    end
    subgraph "Feature (Builder Portal)"
        Projects[Projects Signal]
        Units[Units Signal]
        Documents[Documents Signal]
        Invitations[Invitations Signal]
        Dashboard["Dashboard — computed(), never fetched"]
    end
    Auth --> OrgCtx --> RBAC
    Projects & Units & Documents & Invitations --> Dashboard
    RBAC -.gates visibility of.-> Projects & Units & Documents & Invitations
```

---

## 2. State Ownership Diagram

```mermaid
flowchart LR
    Global["Global / Core\n(Auth, OrgContext, RBAC, Theme)"] --> Feature["Feature\n(Projects, Units, Documents, Invitations, Dashboard, Settings)"]
    Feature --> Component["Component\n(form inputs, UI toggles)"]
    Global -.injected into.-> Feature
    Feature -.injected into.-> Component
```

---

## 3. State Lifecycle

```mermaid
stateDiagram-v2
    [*] --> AppBootstrap: App loads
    AppBootstrap --> CoreResolved: Auth + OrgContext + RBAC + Theme signals resolved
    CoreResolved --> RouteActive: User navigates to a Feature route
    RouteActive --> FeatureStateLoaded: Feature signal fetches (Server State → cached as Signal)
    FeatureStateLoaded --> RouteActive: User interacts (mutations invalidate + refetch)
    RouteActive --> FeatureStateDestroyed: User navigates away (route injector destroyed)
    FeatureStateDestroyed --> RouteActive: Navigate back — fresh fetch, not restored from memory
    CoreResolved --> [*]: Logout — all Core + Feature state cleared
```

---

## 4. Signals Flow

```mermaid
flowchart LR
    Supabase[(Supabase)] -->|Promise/Observable| Boundary["toSignal() boundary"]
    Boundary --> Owned["Owned Signal (Feature or Core)"]
    Owned --> Computed["computed() — Dashboard, permission-gated UI"]
    Owned --> Template[Template — automatic change detection]
    Computed --> Template
```

---

## 5. Server State Flow

```mermaid
sequenceDiagram
    participant Component
    participant Feature as Feature Signal (cache)
    participant Supabase

    Component->>Feature: Read signal (sync)
    alt Cache empty or invalidated
        Feature->>Supabase: Query/RPC (async)
        Supabase-->>Feature: Response
        Feature->>Feature: toSignal(), cache keyed by Organization ID
    end
    Feature-->>Component: Current value (sync, reactive)
```

---

## 6. Client State Flow

```mermaid
flowchart LR
    UserInput[User Input] --> ComponentSignal[Component-local Signal]
    ComponentSignal --> Template[Template, immediate]
    ComponentSignal -.only if genuinely shared.-> FeatureSignal[Feature Signal]
```

---

## 7. Cache Strategy

```mermaid
flowchart TB
    Mutation[Create/Update/Delete] --> Invalidate["Invalidate this Feature's own cache entry"]
    Invalidate --> Refetch[Refetch on next read]
    Refetch --> CacheKey{"Cache key includes\nOrganization ID?"}
    CacheKey -->|Always, no exception| Store[Store as Signal]
```

---

## 8. Synchronization Flow

```mermaid
flowchart LR
    Owner["Single Signal owner\n(one Feature or Core service)"] --> Consumer1[Template A]
    Owner --> Consumer2[Template B]
    Owner --> Consumer3["computed() derivation"]
    Owner -.no manual sync needed, automatic via change detection.-> Consumer1 & Consumer2 & Consumer3
```
