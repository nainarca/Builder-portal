# NG-002 — Workspace Diagrams

**Companion to:** [`../NG-002_Angular_Workspace_Architecture.md`](../NG-002_Angular_Workspace_Architecture.md)

---

## 1. Workspace Architecture

```mermaid
flowchart TB
    subgraph "MyPropertyAsset Web Platform Workspace (Nx)"
        subgraph Applications
            PW[public-website]
            SA[super-admin]
            BA[builder-portal]
        end
        subgraph Features
            PWF[Marketing & Conversion]
            SAF["Builder Onboarding / Tenancy & Branding /\nCommercial / Operations"]
            BAF["Project & Unit Prep / Handover /\nReporting / Communication"]
        end
        subgraph "Core"
            Auth[shared-auth]
            OrgCtx[shared-organization-context]
            RBAC[shared-rbac]
        end
        subgraph "Shared"
            DataAccess[shared-data-access]
            Models[shared-models]
        end
        subgraph Utility
            Util[util-*]
        end
        subgraph Theme
            UI[shared-ui]
            Tokens[theme-tokens]
            Runtime[theme-runtime]
        end
    end

    PW --> PWF --> Auth & OrgCtx & RBAC
    SA --> SAF --> Auth & OrgCtx & RBAC
    BA --> BAF --> Auth & OrgCtx & RBAC
    Auth & OrgCtx & RBAC --> DataAccess & Models
    DataAccess & Models --> Util
    UI --> Tokens --> Util
```

---

## 2. Project Organization

```mermaid
flowchart LR
    subgraph "Axis 1: Application"
        A1[Public Website]
        A2[Super Admin]
        A3[Builder Portal]
    end
    subgraph "Axis 2: Business Domain (per A-007)"
        B1[Marketing & Leads]
        B2[Builder Onboarding]
        B3[Project & Unit]
    end
    subgraph "Axis 3: Technical Domain"
        C1[Core]
        C2[Shared]
        C3[Utility]
        C4[Theme]
    end
```

---

## 3. Logical Project Structure

```mermaid
flowchart TB
    App[Application Project] --> Feature[Feature Project\ntype:feature, scope:X]
    Feature --> Core[Core Project\ntype:core]
    Feature --> Theme[Theme Project\ntype:theme]
    Core --> Shared[Shared Project\ntype:shared]
    Theme --> Util[Utility Project\ntype:util]
    Shared --> Util
```

---

## 4. Library Relationships

```mermaid
flowchart TB
    SharedUI[shared-ui] --> ThemeTokens[theme-tokens]
    ThemeTokens --> ThemeRuntime[theme-runtime]
    SharedDataAccess[shared-data-access] --> SharedModels[shared-models]
    SharedAuth[shared-auth] --> SharedOrgContext[shared-organization-context]
    SharedRBAC[shared-rbac] -.derived from.-> PermissionMatrix["PERMISSION_MATRIX.md\n(A-008, not code)"]
```

---

## 5. Dependency Diagram (tag-enforced)

```mermaid
flowchart TB
    TypeApp["type:app"] --> TypeFeature["type:feature"]
    TypeFeature --> TypeCore["type:core"]
    TypeFeature --> TypeShared["type:shared"]
    TypeFeature --> TypeTheme["type:theme"]
    TypeCore --> TypeShared
    TypeCore --> TypeUtil["type:util"]
    TypeShared --> TypeUtil
    TypeTheme --> TypeUtil
    TypeFeature -.FORBIDDEN.-x TypeFeature2["type:feature (sibling)"]
    TypeCore -.FORBIDDEN.-x TypeApp
    TypeShared -.FORBIDDEN.-x TypeApp
```

---

## 6. Workspace Expansion Strategy

```mermaid
flowchart LR
    Today["Today: 3 applications,\n~10 feature libraries,\n6+ platform libraries"] --> Add1[Add a feature: new type:feature project,\nscoped to one existing app]
    Today --> Add2[Add a platform capability:\nnew type:core/shared/util/theme project]
    Today --> Add3["Add a product: new type:app project\n(Tenant Platform, etc.)"]
    Add1 & Add2 & Add3 --> NoModification[None of these require modifying\nan existing project's internals]
```

---

## 7. Future Product Integration

```mermaid
flowchart TB
    subgraph "Existing"
        PW[public-website]
        SA[super-admin]
        BA[builder-portal]
        Platform[Core / Shared / Utility / Theme]
    end
    subgraph "Future — added, not retrofitted"
        TP["tenant-platform\n(A-003 §9, A-007 ID-15)"]
        SM["service-marketplace\n(A-001 'Future Marketplace')"]
        PP["partner-portal\n(NG-001 — no business backing yet)"]
    end
    Platform --> PW & SA & BA
    Platform -.same tag rules apply.-> TP & SM & PP
```
