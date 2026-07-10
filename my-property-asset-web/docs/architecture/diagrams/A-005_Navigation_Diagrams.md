# A-005 — Navigation Diagrams

**Companion to:** [`../A-005_Navigation_Flow.md`](../A-005_Navigation_Flow.md)

---

## 1. Global Navigation Map

```mermaid
flowchart TB
    subgraph "Public Website (unauthenticated)"
        PWNav[Main Navigation]
    end
    subgraph "Super Admin Portal"
        SANav[Administration Menu]
    end
    subgraph "Builder Handover Portal"
        BANav[Global Sidebar]
    end
    subgraph "Owner Mobile App (reference only)"
        OANav[Existing Navigation\nunmodified]
    end

    PWNav -->|Login Gateway| SANav
    PWNav -->|Login Gateway| BANav
    BANav -.invitation deep link.-> OANav
```

---

## 2. Public Website Navigation

```mermaid
flowchart LR
    Main[Main Navigation] --> Home
    Main --> Features
    Main --> Pricing
    Main --> About
    Main --> Login[Login Gateway]
    Footer[Footer Navigation] --> FAQ
    Footer --> Contact
    Footer --> BuilderReg[Builder Registration]
    FAQ -.escalate.-> Contact
```

---

## 3. Super Admin Navigation

```mermaid
flowchart TB
    Dashboard --> AdminMenu[Administration Menu]
    AdminMenu --> Builders
    AdminMenu --> Organizations
    AdminMenu --> Users
    AdminMenu --> Monitoring
    AdminMenu --> Audit
    AdminMenu --> Settings
    Builders --> BuilderDetail[Builder Detail]
    BuilderDetail --> Whitelabel[White-label]
    BuilderDetail --> Subscription
```

---

## 4. Builder Navigation

```mermaid
flowchart TB
    Dashboard --> Projects
    Dashboard --> Owners["Owners\n(navigation gap)"]
    Dashboard --> Invitations
    Dashboard --> Documents
    Dashboard --> Reports
    Dashboard --> Notifications
    Dashboard --> Settings
    Dashboard --> Profile["Profile\n(navigation gap)"]
    Projects --> ProjectDetail[Project Detail]
    ProjectDetail --> Units
    Units --> UnitDetail[Unit Detail]
    UnitDetail --> OwnerAssignment[Owner Assignment]
    UnitDetail --> DocUpload[Document Upload]
    UnitDetail -.status.-> Invitations
```

---

## 5. Cross Product Navigation

```mermaid
flowchart LR
    PublicWebsite[Public Website] -->|Builder Registration| SuperAdmin[Super Admin]
    SuperAdmin -->|Approve| BuilderPortal[Builder Portal]
    BuilderPortal -->|Invitation + Handover| OwnerApp[Owner Mobile App]
    SuperAdmin -.monitoring/support, no shared UI.-> BuilderPortal
    SuperAdmin -.monitoring/support, no shared UI.-> OwnerApp

    style PublicWebsite fill:#eee
    style SuperAdmin fill:#eee
    style BuilderPortal fill:#eee
    style OwnerApp fill:#eee
```
No product ever shares a navigation surface with another — every arrow above is a one-time handoff (registration, approval, invitation), never a merged menu.

---

## 6. Navigation Hierarchy

```mermaid
flowchart TB
    Root((Web Platform))
    Root --> PW[Public Website]
    Root --> SA[Super Admin Portal]
    Root --> BA[Builder Handover Portal]
    Root -.reference.-> OA[Owner Mobile App]

    PW --> PWMain[Main Nav]
    PW --> PWFooter[Footer Nav]
    PW --> PWAuth[Authentication Nav]

    SA --> SADash[Dashboard Nav]
    SADash --> SAAdmin[Administration Menu]
    SAAdmin --> SABuilder[Builder Nav]
    SAAdmin --> SAOrg[Organization Nav]
    SAAdmin --> SAMonitor[Monitoring Nav]
    SAAdmin --> SAAudit[Audit Nav]
    SAAdmin --> SASettings[Settings Nav]
    SABuilder --> SASub[Subscription Nav]

    BA --> BADash[Dashboard Nav]
    BADash --> BAProj[Projects Nav]
    BAProj --> BAUnits[Units Nav]
    BADash --> BAOwners["Owners Nav (gap)"]
    BADash --> BADocs[Documents Nav]
    BADash --> BAInvite[Invitations Nav]
    BADash --> BAReports[Reports Nav]
    BADash --> BANotif[Notifications Nav]
    BADash --> BASettings[Settings Nav]
    BADash --> BAProfile["Profile Nav (gap)"]
```

---

## 7. Breadcrumb Flow

```mermaid
flowchart LR
    B1["Builders"] --> B2["Builders > Acme Developers"]
    B2 --> B3["Builders > Acme Developers > White-label"]

    C1["Projects"] --> C2["Projects > Sunrise Towers"]
    C2 --> C3["Projects > Sunrise Towers > Units"]
    C3 --> C4["Projects > Sunrise Towers > Units > Unit 4B"]
```
Breadcrumbs appear only at three-or-more levels of depth (A-005 §11) — Public Website and shallow Super Admin/Builder sections (Monitoring, Audit, Settings, Reports, Notifications) rely on the persistent Global Navigation menu alone.

---

## 8. Menu Hierarchy

```mermaid
flowchart TB
    subgraph "Super Admin — Primary (Global)"
        direction LR
        S1[Dashboard] --- S2[Builders] --- S3[Organizations] --- S4[Users] --- S5[Monitoring] --- S6[Audit] --- S7[Settings]
    end
    subgraph "Super Admin — Secondary (within Builder Detail)"
        direction LR
        S8[Overview] --- S9[White-label] --- S10[Subscription]
    end
    S2 --> S8

    subgraph "Builder Portal — Primary (Global)"
        direction LR
        B1[Dashboard] --- B2[Projects] --- B3["Owners (gap)"] --- B4[Invitations] --- B5[Documents] --- B6[Reports] --- B7[Notifications] --- B8[Settings]
    end
    subgraph "Builder Portal — Account Menu"
        direction LR
        B9["Profile (gap)"]
    end
```

---

## 9. Deep Link Map

```mermaid
flowchart TB
    DL1["Direct link: Public Website page"] -->|always safe| Render1[Renders immediately, no precondition]
    DL2["Direct link: Super Admin screen"] -->|session valid?| Check1{Authenticated as Super Admin?}
    Check1 -->|Yes| Render2[Resolves to exact screen]
    Check1 -->|No| Reauth1[Re-authenticate, then resolve to exact screen]
    DL3["Direct link: Builder Portal screen"] -->|session + org check| Check2{Authenticated AND own Organization?}
    Check2 -->|Yes| Render3[Resolves to exact screen]
    Check2 -->|No| Deny[Fails closed — access denied, not a generic view]
    DL4["Invitation link (Builder → Owner)"] --> OwnerApp["Owner Mobile App\nactivation/property-review\n(existing app, new entry point)"]
```
