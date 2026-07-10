# NG-008 — Source Tree Diagrams

**Companion to:** [`../NG-008_Folder_Structure_Architecture.md`](../NG-008_Folder_Structure_Architecture.md)

---

## 1. Complete Source Tree

```mermaid
flowchart TB
    Root["my-property-asset-web/"] --> Apps["apps/"]
    Root --> Libs["libs/"]
    Root --> Docs["docs/ (existing)"]
    Root --> Tools["tools/"]
    Root --> Config["nx.json, tsconfig.base.json, package.json"]

    Apps --> PW["public-website/ (+ -e2e)"]
    Apps --> SA["super-admin/ (+ -e2e)"]
    Apps --> BP["builder-portal/ (+ -e2e)"]

    Libs --> Core["core/"]
    Libs --> Shared["shared/"]
    Libs --> Util["util/"]
    Libs --> Theme["theme/"]
    Libs --> Infra["infra/"]
    Libs --> Feature["feature/"]
```

---

## 2. Workspace Hierarchy

```mermaid
flowchart TB
    Workspace["Workspace (Nx monorepo, ADR-010)"] --> AppAxis["Application axis\n(apps/, 3 projects)"]
    Workspace --> TechAxis["Technical domain axis\n(libs/core, shared, util, theme, infra)"]
    Workspace --> BizAxis["Business domain axis\n(libs/feature, scoped per app)"]

    AppAxis -.governed by.-> ADR009["ADR-009 — 3 independent apps"]
    TechAxis -.governed by.-> LibStrategy["LIBRARY_STRATEGY.md §6"]
    BizAxis -.governed by.-> A007["A-007 Information Domains"]
```

---

## 3. Feature Hierarchy

```mermaid
flowchart TB
    FeatureRoot["libs/feature/"] --> PWF["public-website/"]
    FeatureRoot --> SAF["super-admin/"]
    FeatureRoot --> BPF["builder-portal/"]

    PWF --> PW1["marketing-conversion/"]

    SAF --> SA1["builder-onboarding/"]
    SAF --> SA2["tenancy-branding/"]
    SAF --> SA3["commercial/"]
    SAF --> SA4["operations/"]
    SAF --> SA5["audit/ (gap-flagged)"]
    SAF --> SA6["users/ (gap-flagged)"]
    SAF --> SA7["dashboard/ (computed()-only)"]
    SAF --> SA8["settings/"]
    SAF --> SA9["communication/"]

    BPF --> BP1["projects/ (backend-dependent)"]
    BPF --> BP2["units/ (backend-dependent)"]
    BPF --> BP3["documents/"]
    BPF --> BP4["invitations/"]
    BPF --> BP5["reporting/"]
    BPF --> BP6["dashboard/ (computed()-only)"]
    BPF --> BP7["settings/"]
    BPF --> BP8["communication/"]

    NoProperty["NO properties/, loans/, expenses/\nanywhere in this tree"]
    style NoProperty fill:#eee,stroke-dasharray: 5 5
```

---

## 4. Library Placement

```mermaid
flowchart LR
    subgraph Core["libs/core (type:core)"]
        C1[auth]
        C2[organization-context]
        C3[rbac]
    end
    subgraph Shared["libs/shared (type:shared)"]
        S1[data-access]
        S2[models]
        S3[ui]
    end
    subgraph Util["libs/util (type:util)"]
        U1[formatting - reserved]
        U2[validation - reserved]
        U3[search]
    end
    subgraph Theme["libs/theme (type:theme)"]
        T1[tokens]
        T2[runtime]
    end
    subgraph Infra["libs/infra (type:util)"]
        I1[logging]
        I2[error-handling]
        I3[config]
        I4[caching]
        I5[feature-flags]
    end
```

---

## 5. Folder Dependency Diagram

```mermaid
flowchart TB
    AppsF["apps/*"] --> FeatureF["libs/feature/*"]
    AppsF --> CoreF["libs/core/*"]
    AppsF --> SharedF["libs/shared/*"]
    AppsF --> ThemeF["libs/theme/*"]
    FeatureF --> CoreF
    FeatureF --> SharedF
    FeatureF --> UtilF["libs/util/*"]
    FeatureF --> ThemeF
    CoreF --> SharedF
    CoreF --> UtilF
    CoreF --> ThemeF
    SharedF --> UtilF
    ThemeF --> UtilF
    InfraF["libs/infra/*"] -.consumable by all.-> AppsF & FeatureF & CoreF & SharedF & ThemeF

    FeatureF -.NEVER.-x FeatureF
    AppsF -.NEVER.-x AppsF
```

---

## 6. Shared Folder Structure

```mermaid
flowchart TB
    Shared["libs/shared/"] --> DA["data-access/\n(shared-data-access — one sub-path per Information Domain,\nnone for ID-13)"]
    Shared --> M["models/\n(shared-models — hand-authored domain types\n+ reserved generated/ sub-path)"]
    Shared --> UI["ui/\n(shared-ui — components + shared assets/)"]
```

---

## 7. Asset Structure

```mermaid
flowchart TB
    SharedAssets["libs/shared/ui/src/assets/\n(icons, shared imagery, fonts)"] --> Consumed1["Consumed by all 3 apps"]
    AppAssets["apps/<app>/src/assets/\n(app-specific only)"] --> Consumed2["Consumed by that app only"]
    OrgAssets["Organization logo / branding"] -.NEVER a folder here — runtime data.-> Storage["Supabase Storage\n(fetched at runtime by theme-runtime)"]
```

---

## 8. Theme Structure

```mermaid
flowchart LR
    Tokens["libs/theme/tokens/\n(data contract, SCSS variables)"] --> Runtime["libs/theme/runtime/\n(resolution + application mechanism)"]
    Runtime --> Bootstrap["Resolved at Shell bootstrap\n(per-app, Organization-scoped)"]
    Tokens --> UIComponents["shared-ui components\n(read tokens, never hard-code values)"]
```

---

## 9. Documentation Structure

```mermaid
flowchart TB
    DocsRoot["docs/"] --> Arch["architecture/ (A-series)"]
    DocsRoot --> Tech["technical/ (NG-series, UI-series, API-series)"]
    DocsRoot --> Adr["adr/ (ADR_INDEX.md)"]
    DocsRoot --> Index["ARCHITECTURE_INDEX.md"]
    Tech --> TechDiagrams["technical/diagrams/"]
    Arch --> ArchDiagrams["architecture/diagrams/"]

    CodeReadme["Every libs/ and apps/ project's own README.md"] -.traces back to.-> Arch
```
