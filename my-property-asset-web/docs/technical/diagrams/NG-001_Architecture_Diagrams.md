# NG-001 — Angular Enterprise Architecture Diagrams

**Companion to:** [`../NG-001_Angular_Enterprise_Architecture.md`](../NG-001_Angular_Enterprise_Architecture.md)

---

## 1. Enterprise Angular Architecture (top level)

```mermaid
flowchart TB
    subgraph "Public Website App"
        PWFeature[Marketing & Conversion]
    end
    subgraph "Super Admin App"
        SAFeatures["Builder Onboarding / Tenancy & Branding /\nCommercial / Operations"]
    end
    subgraph "Builder Portal App"
        BAFeatures["Project & Unit Prep / Handover /\nReporting / Communication"]
    end

    PWFeature --> Shared["shared-ui, shared-models"]
    SAFeatures --> Shared2["shared-ui, shared-auth, shared-rbac,\nshared-organization-context, shared-data-access, shared-models"]
    BAFeatures --> Shared2

    Shared --> Infra[Infrastructure: logging, error handling, config]
    Shared2 --> Infra
    Infra --> Backend[Backend Integration: Supabase Client]
    Backend --> Supabase[(Supabase / PostgreSQL)]

    OwnerApp["Owner Mobile App (Flutter)\nexisting, unmodified"] -.shared backend only.-> Supabase
```

---

## 2. Application Layer Diagram

```mermaid
flowchart TB
    Presentation[Presentation Layer\ncomponents — UI + interaction only] --> Application[Application Layer\nservices, stores, facades]
    Application --> Domain[Domain Layer\nbusiness rules, validators]
    Domain --> BackendIntegration[Backend Integration Layer\nSupabase client — only network-touching layer]
    Infrastructure["Infrastructure Layer\nlogging / error handling / config\n(cross-cutting — available to all layers above)"] -.-> Presentation
    Infrastructure -.-> Application
    Infrastructure -.-> Domain
    Infrastructure -.-> BackendIntegration
```

---

## 3. Feature Boundary Diagram

```mermaid
flowchart LR
    subgraph "Builder Portal App"
        F1[Project & Unit Prep] -.NO DIRECT IMPORT.-x F2[Handover]
        F2 -.NO DIRECT IMPORT.-x F3[Reporting]
        F1 --> Core[App Core]
        F2 --> Core
        F3 --> Core
        Core --> Shared[shared-*]
    end
```
Dashed crossed-out lines indicate the forbidden direct path; the only real path between features is through Core.

---

## 4. Dependency Diagram

```mermaid
flowchart TB
    App[Application] --> Feature
    Feature --> Core
    Core --> Shared["Shared (shared-ui, shared-auth, shared-rbac,\nshared-organization-context, shared-data-access, shared-models)"]
    Shared --> Infrastructure
    Infrastructure --> BackendIntegration
    Shared -.never depends on.-x App
    Shared -.never depends on.-x Feature
    Feature -.never depends on.-x Feature
```

---

## 5. Shell Architecture

```mermaid
flowchart TB
    Bootstrap[App Bootstrap] --> AuthCheck{Authenticated app?}
    AuthCheck -->|Public Website: No| RenderShell1[Render Shell\nheader/footer only]
    AuthCheck -->|Super Admin / Builder Portal: Yes| ResolveAuth[Resolve Auth Session]
    ResolveAuth --> ResolveOrg[Resolve Organization Context]
    ResolveOrg --> ResolveRBAC[Resolve RBAC Permission Set\nfrom PERMISSION_MATRIX.md]
    ResolveRBAC --> ApplyTheme[Apply Organization White-label Theme]
    ApplyTheme --> RenderShell2[Render Shell\nsidebar + topbar + content outlet]
```

---

## 6. Layout Architecture

```mermaid
flowchart LR
    subgraph "Public Website Layout"
        Header --> Content1[Content Outlet] --> Footer
    end
    subgraph "Super Admin / Builder Portal Layout"
        Topbar --> Sidebar
        Sidebar --> Content2[Content Outlet]
        Content2 --> Breadcrumb["Breadcrumb region\n(only at 3+ levels deep, per A-005 §11"]
    end
```

---

## 7. Cross Module Communication

```mermaid
flowchart LR
    FeatureA[Feature A] -->|1: via Core service| Core
    Core -->|read by| FeatureB[Feature B]
    FeatureA -->|2: via routing| Router
    Router -->|navigates to| FeatureB
    FeatureA -->|3: via Core event mechanism\ncontract in shared-models| EventBus[Core Event Mechanism]
    EventBus -->|received by| FeatureB
    FeatureA -.NEVER direct import.-x FeatureB
```

---

## 8. Platform Architecture

```mermaid
flowchart TB
    subgraph "Workspace"
        subgraph Apps
            PW[Public Website App]
            SA[Super Admin App]
            BA[Builder Portal App]
        end
        subgraph "Shared Platform"
            UI[shared-ui]
            Auth[shared-auth]
            RBAC[shared-rbac]
            OrgCtx[shared-organization-context]
            DataAccess[shared-data-access]
            Models[shared-models]
        end
    end
    PW --> UI
    PW --> Models
    SA --> UI & Auth & RBAC & OrgCtx & DataAccess & Models
    BA --> UI & Auth & RBAC & OrgCtx & DataAccess & Models
```

---

## 9. Future Expansion Model

```mermaid
flowchart TB
    subgraph "Today"
        PW[Public Website App]
        SA[Super Admin App]
        BA[Builder Portal App]
    end
    subgraph "Future — added without modifying existing apps"
        TP["Tenant Platform\n(A-003 §9, A-007 ID-15)"]
        PP["Partner Portal\n(named by NG-001 prompt only —\nno business-architecture backing yet)"]
        SM["Service Marketplace\n(A-001 'Future Marketplace')"]
    end
    Shared[Shared Platform] --> PW & SA & BA
    Shared -.same reuse pattern.-> TP & PP & SM
```
