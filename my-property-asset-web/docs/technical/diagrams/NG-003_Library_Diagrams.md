# NG-003 — Library Diagrams

**Companion to:** [`../NG-003_Angular_Library_Architecture.md`](../NG-003_Angular_Library_Architecture.md)

---

## 1. Package Architecture

```mermaid
flowchart TB
    subgraph "Core"
        Auth[shared-auth]
        OrgCtx[shared-organization-context]
        RBAC[shared-rbac]
    end
    subgraph "Shared"
        DataAccess[shared-data-access]
        Models[shared-models]
    end
    subgraph "Infrastructure"
        Logging[infra-logging]
        ErrorHandling[infra-error-handling]
        Config[infra-config]
        Caching[infra-caching]
        FeatureFlags[infra-feature-flags]
    end
    subgraph "Utility"
        Util[util-*]
        Search[search]
    end
    subgraph "Theme"
        UI[shared-ui]
        Tokens[theme-tokens]
        Runtime[theme-runtime]
    end
    subgraph "Feature — Builder Portal (finer-grained)"
        Projects[builder-portal-projects]
        Units[builder-portal-units]
        Documents[builder-portal-documents]
        Invitations[builder-portal-invitations]
    end

    Core --> Shared --> Infrastructure
    Utility --> Infrastructure
    Theme --> Utility
    Projects & Units & Documents & Invitations --> Core
    Projects -.NO DIRECT IMPORT.-x Units
    Documents -.NO DIRECT IMPORT.-x Invitations
```

---

## 2. Library Dependency Diagram

```mermaid
flowchart TB
    TypeFeature["type:feature"] --> TypeCore["type:core"]
    TypeFeature --> TypeShared["type:shared"]
    TypeFeature --> TypeTheme["type:theme"]
    TypeCore --> TypeShared
    TypeCore --> TypeUtilInfra["type:util (incl. Infrastructure)"]
    TypeShared --> TypeUtilInfra
    TypeTheme --> TypeUtilInfra
    TypeUtilInfra -.leaf, no workspace deps.-> TypeUtilInfra
```

---

## 3. Library Hierarchy

```mermaid
flowchart TB
    App[Application] --> Feature["Feature (per-app, finer-grained)"]
    Feature --> Core
    Feature --> Theme
    Core --> Shared
    Shared --> Infrastructure
    Theme --> Infrastructure
    Infrastructure --> Utility
```

---

## 4. Package Communication

```mermaid
flowchart LR
    Projects[builder-portal-projects] -->|1: Core service| Core
    Core -->|read by| Units[builder-portal-units]
    Documents[builder-portal-documents] -->|2: routing| Router
    Router -->|navigates to| Invitations[builder-portal-invitations]
    Documents -->|3: Core event, contract in shared-models| EventBus
    EventBus -->|received by| Invitations
    Projects -.NEVER direct import.-x Units
```

---

## 5. Core Library Relationships

```mermaid
flowchart LR
    Auth[shared-auth] --> OrgCtx[shared-organization-context]
    OrgCtx --> RBAC[shared-rbac]
    RBAC -.derived from, not code.-> PermMatrix["PERMISSION_MATRIX.md (A-008)"]
```

---

## 6. Feature Library Relationships (Builder Portal, finer-grained)

```mermaid
flowchart TB
    Dashboard[builder-portal-dashboard] -.reads via Core, never imports.-> Projects
    Projects[builder-portal-projects] --> Units[builder-portal-units]
    Units -.via Core/routing only.-> Documents[builder-portal-documents]
    Documents -.via Core/routing only.-> Invitations[builder-portal-invitations]
    Invitations -.via Core/routing only.-> Reports[builder-portal-reports]

    style Projects fill:#eee
    style Units fill:#eee
```
Grey fill marks the two libraries that depend on the still-undesigned Builder Projects backend domain (10th consecutive document to carry this dependency).

---

## 7. Shared Library Relationships

```mermaid
flowchart LR
    SharedUI[shared-ui] --> ThemeTokens[theme-tokens] --> ThemeRuntime[theme-runtime]
    SharedDataAccess[shared-data-access] --> SharedModels[shared-models]
    Search[search] -.consumed by.-> SharedDataAccess
```

---

## 8. Future Package Expansion

```mermaid
flowchart TB
    subgraph "Today"
        Platform[Core / Shared / Infrastructure / Utility / Theme]
        Apps["3 Applications, ~14 finer-grained feature libraries"]
    end
    subgraph "Future — plugs in via infra-feature-flags, no existing library modified"
        TenantLib["tenant-platform-* (reserved)"]
        MarketplaceLib["service-marketplace-* (reserved)"]
    end
    Platform --> Apps
    Platform -.same rules apply.-> TenantLib & MarketplaceLib
```
