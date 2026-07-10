# NG-004 — Routing Diagrams

**Companion to:** [`../NG-004_Angular_Routing_Architecture.md`](../NG-004_Angular_Routing_Architecture.md)

---

## 1. Overall Routing Architecture

```mermaid
flowchart TB
    subgraph "Public Website (unauthenticated)"
        PWRoutes["/  /features  /pricing  /about\n/faq  /contact  /demo-request  /register"]
        PWLogin["/login (Login Gateway)"]
    end
    subgraph "Super Admin (authenticated)"
        SARoutes["/dashboard  /builders  /organizations\n/users  /monitoring  /audit  /settings"]
    end
    subgraph "Builder Portal (authenticated)"
        BARoutes["/dashboard  /projects  /invitations\n/documents  /reports  /notifications  /settings"]
    end
    PWLogin -.hard browser navigation, cross-origin.-> SARoutes
    PWLogin -.hard browser navigation, cross-origin.-> BARoutes
    BARoutes -.invitation deep link, exits this platform.-> OwnerApp["Owner Mobile App\n(Flutter, reference only)"]
```

---

## 2. Application Route Hierarchy

```mermaid
flowchart TB
    Root["/"] --> Projects["/projects"]
    Projects --> ProjectDetail["/projects/:projectId"]
    ProjectDetail --> Units["/projects/:projectId/units"]
    Units --> UnitDetail["/projects/:projectId/units/:unitId"]
    UnitDetail --> Assign["/projects/:projectId/units/:unitId/assign"]
    UnitDetail --> Docs["/projects/:projectId/units/:unitId/documents"]
    Root --> Invitations["/invitations"]
    Root --> DocsLib["/documents"]
    Root --> Reports["/reports"]
```

---

## 3. Navigation Hierarchy

*(Route-level expression of A-005's business navigation hierarchy — see `NAVIGATION_ARCHITECTURE.md` §21 and A-005's own `NAVIGATION_HIERARCHY.md` for the authoritative business-level tree; not re-derived here.)*

```mermaid
flowchart LR
    Nav["Route tree (this document)"] -.expresses.-> BizNav["A-005 NAVIGATION_HIERARCHY.md\n(business-level, authoritative)"]
```

---

## 4. Lazy Loading Diagram

```mermaid
flowchart TB
    subgraph Eager
        Shell
        Core["Core: shared-auth, shared-organization-context, shared-rbac"]
        Infra["Infrastructure: logging, error-handling, config, feature-flags"]
        Theme["Theme: shared-ui, theme-tokens, theme-runtime"]
    end
    subgraph "Lazy (per route)"
        Projects["builder-portal-projects"]
        Units["builder-portal-units"]
        Documents["builder-portal-documents"]
        Invitations["builder-portal-invitations"]
        Reports["builder-portal-reports"]
    end
    Shell --> Core --> Infra --> Theme
    Shell -.route navigation triggers load.-> Projects & Units & Documents & Invitations & Reports
```

---

## 5. Layout Architecture

```mermaid
flowchart LR
    subgraph "Public Website Layout"
        Header --> Outlet1[Route Outlet] --> Footer
    end
    subgraph "Super Admin / Builder Portal Layout"
        Topbar --> Sidebar --> Outlet2[Route Outlet]
        Outlet2 --> Breadcrumb["Breadcrumb\n(only /projects/:id/units/:id/** — 4 segments deep)"]
    end
```

---

## 6. Authentication Flow (routing-level)

```mermaid
sequenceDiagram
    participant User
    participant App as Super Admin / Builder Portal App
    participant Auth as shared-auth
    participant OrgCtx as shared-organization-context
    participant RBAC as shared-rbac

    User->>App: Navigate to /dashboard (deep link or direct)
    App->>Auth: Validate session
    alt Not authenticated
        Auth->>User: Redirect to /login, preserve original destination
        User->>Auth: Authenticate
        Auth->>App: Resume original navigation
    end
    App->>OrgCtx: Resolve Organization Context
    App->>RBAC: Resolve permission set (PERMISSION_MATRIX.md)
    App->>User: Render /dashboard
```

---

## 7. Protected Route Diagram

```mermaid
flowchart TB
    Route[Requested Route] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Login[Redirect to /login]
    AuthCheck -->|Yes| RoleCheck{Role permits this route?\nper PERMISSION_MATRIX.md}
    RoleCheck -->|No| Unauthorized["Unauthorized state\n(not 404 — route exists, access denied)"]
    RoleCheck -->|Yes| OrgCheck{Organization-scoped resource\nbelongs to session's Organization?}
    OrgCheck -->|No, enforced by RLS not routing| Denied[RLS denies at data layer]
    OrgCheck -->|Yes| Render[Render route]
```

---

## 8. Feature Route Boundaries

```mermaid
flowchart LR
    subgraph "Builder Portal — independent route zones"
        R1["/projects/**"]
        R2["/units/** (nested under /projects/:id)"]
        R3["/documents/**"]
        R4["/invitations/**"]
    end
    R1 -.NEVER nests inside.-x R3
    R3 -.NEVER nests inside.-x R4
    R4 -.NEVER nests inside.-x R1
```

---

## 9. Deep Link Diagram

```mermaid
flowchart TB
    DL1["Public Website deep link"] --> R1[Always resolves, no precondition]
    DL2["Super Admin / Builder Portal deep link\n(authenticated route)"] --> Check{Session valid?}
    Check -->|No| Redirect["Redirect to /login,\npreserve original destination"]
    Redirect --> Continue[Resume after auth]
    Check -->|Yes| R2[Resolves directly]
    DL3["Invitation link"] --> OwnerApp["Exits to Owner Mobile App\n(reference only)"]
```
