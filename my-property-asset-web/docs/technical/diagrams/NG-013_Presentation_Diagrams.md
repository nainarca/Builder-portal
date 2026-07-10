# NG-013 — Presentation Diagrams

**Companion to:** [`../NG-013_Frontend_Presentation_Architecture.md`](../NG-013_Frontend_Presentation_Architecture.md)

---

## 1. Presentation Architecture

```mermaid
flowchart TB
    State["Signals (NG-005)"] --> Component["Component reads, never owns"]
    Component --> Classify["Three-tier classification\n(Primitive / Composite / Feature)"]
    Classify --> Tokens["Design Tokens"]
    Classify --> PrimeNG["PrimeNG — touched only by shared-ui"]
    Tokens --> Theme["theme-runtime — resolved at bootstrap"]
```

---

## 2. Design System Hierarchy

```mermaid
flowchart TB
    DesignSystem["Design System\n(thin layer over PrimeNG)"] --> Tokens["Design Tokens\n(color, type, spacing, icon)"]
    DesignSystem --> Primitives["Primitive components\n(shared-ui, wraps PrimeNG)"]
    Primitives --> Composites["Composite components\n(Form, Table, Dialog, Notification,\nLoading, Empty State, Error)"]
    Composites --> FeatureComponents["Feature components\n(business-specific, not reused)"]
```

---

## 3. Component Hierarchy

```mermaid
flowchart TB
    Feature["Feature component"] --> Composite["Composite component"]
    Composite --> Primitive["Primitive component"]
    Primitive --> PrimeNGLib["PrimeNG"]
    Primitive --> DesignTokens["Design Tokens"]

    Feature -.NEVER.-x Feature2["Sibling Feature component"]
    Composite -.NEVER.-x Composite2["Sibling Composite\n(no lateral dependency)"]
```

---

## 4. Layout Hierarchy

```mermaid
flowchart TB
    Shell["Application Shell\n(per-app, not shared-ui)"] --> LayoutShape{"Layout shape"}
    LayoutShape -->|Public Website| HeaderFooter["Header/Footer layout"]
    LayoutShape -->|Super Admin, Builder Portal| SidebarTopbar["Sidebar + Topbar + Content Outlet"]
    SidebarTopbar --> Nav["Navigation Presentation\n(reads RBAC permission Signal)"]
    Shell --> Dashboard["Dashboard Presentation\n(computed() only, no own fetch)"]
```

---

## 5. Theme Architecture

```mermaid
flowchart LR
    OrgContext["Organization Context resolves\n(bootstrap sequence)"] --> ThemeRuntime["theme-runtime resolves tokens"]
    ThemeRuntime --> PrimeNGTheming["PrimeNG token-based theming API"]
    PrimeNGTheming --> Render["Components render with\nresolved Organization branding"]
    ThemeRuntime -.bounded surface only.-> WhiteLabel["primary color, logo,\n(future) accent color — nothing else"]
```

---

## 6. Design Token Relationships

```mermaid
flowchart TB
    ThemeTokens["theme-tokens\n(data contract)"] --> Color["Color System\n(semantic tokens, AA-verified)"]
    ThemeTokens --> Typography["Typography\n(fixed scale, not white-label)"]
    ThemeTokens --> Spacing["Spacing System\n(shared scale w/ breakpoints)"]
    ThemeTokens --> Icon["Iconography\n(token-colored, shared-ui only)"]

    Color --> Danger["color-danger — NEVER white-label overridable"]
    style Danger fill:#eee,stroke-dasharray: 5 5
```

---

## 7. Responsive Breakpoint Strategy

```mermaid
flowchart LR
    Mobile["Mobile\n(fully responsive, not reduced)"] --> Tablet["Tablet\n(collapsible sidebar —\nonly non-interpolated tier)"]
    Tablet --> Desktop["Desktop\n(reference layout,\nnot functionally privileged)"]
    Mobile -.same component tree.-> OneComponent["One responsive component,\nnever device-specific components"]
    Tablet -.same component tree.-> OneComponent
    Desktop -.same component tree.-> OneComponent
```

---

## 8. White-label Theme Flow

```mermaid
sequenceDiagram
    participant Shell
    participant OrgCtx as Organization Context
    participant ThemeRuntime as theme-runtime
    participant PrimeNG

    Shell->>OrgCtx: Resolve (post-auth)
    OrgCtx-->>ThemeRuntime: Organization ID
    ThemeRuntime->>ThemeRuntime: Fetch Organization's token overrides\n(primary color, logo — bounded surface)
    ThemeRuntime->>PrimeNG: Supply resolved tokens
    PrimeNG-->>Shell: Themed components ready
    Shell->>Shell: First paint (theme resolved before render — CLS guarantee)
```
