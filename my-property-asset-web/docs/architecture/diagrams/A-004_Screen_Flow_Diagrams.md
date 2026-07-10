# A-004 — Screen Flow Diagrams

**Companion to:** [`../A-004_Screen_Flow.md`](../A-004_Screen_Flow.md)

---

## 1. Platform Screen Map

```mermaid
flowchart TB
    subgraph "Public Website"
        PW1[Home] --> PW2[Features]
        PW1 --> PW3[Pricing]
        PW1 --> PW4[About]
        PW1 --> PW5[FAQ]
        PW1 --> PW6[Contact Sales]
        PW1 --> PW7[Demo Request]
        PW1 --> PW8[Builder Registration]
        PW1 --> PW9[Login Gateway]
    end

    subgraph "Super Admin Portal"
        SA1[Login] --> SA2[Dashboard]
        SA2 --> SA3[Builder Mgmt List]
        SA3 --> SA4[Builder Detail/Approval]
        SA4 --> SA6[White-label Config]
        SA4 --> SA7[Subscription Mgmt]
        SA2 --> SA5[Organization Mgmt]
        SA2 --> SA8[User Mgmt]
        SA2 --> SA9[Monitoring]
        SA2 --> SA10[Audit Log]
        SA2 --> SA11[Settings]
    end

    subgraph "Builder Handover Portal"
        BA1[Login] --> BA2[Dashboard]
        BA2 --> BA3[Projects]
        BA3 --> BA4[Project Detail]
        BA4 --> BA5[Units]
        BA5 --> BA6[Unit Detail]
        BA6 --> BA7[Owner Assignment]
        BA6 --> BA8[Document Upload]
        BA2 --> BA9[Invitations]
        BA2 --> BA10[Documents Library]
        BA2 --> BA11[Reports]
        BA2 --> BA12[Notifications]
        BA2 --> BA13[Settings]
    end

    PW8 -.creates.-> SA3
    PW9 -.routes.-> SA1
    PW9 -.routes.-> BA1
    SA4 -.provisions.-> BA1
    BA9 -.invites.-> OwnerApp[Owner Mobile App\nreference only]
```

---

## 2. Public Website Screen Flow

```mermaid
flowchart LR
    Home --> Features --> Pricing
    Home --> About --> FAQ
    Pricing --> DemoRequest[Demo Request]
    Pricing --> ContactSales[Contact Sales]
    FAQ -->|unanswered| ContactSales
    Features --> BuilderReg[Builder Registration]
    Home --> LoginGateway[Login Gateway]
```

---

## 3. Super Admin Screen Flow

```mermaid
flowchart LR
    Login --> Dashboard
    Dashboard --> BuilderList[Builder Management]
    BuilderList --> BuilderDetail[Builder Detail]
    BuilderDetail -->|Approve| Whitelabel[White-label Config]
    BuilderDetail -->|Approve| Subscription[Subscription Mgmt]
    BuilderDetail -->|Reject| Notify[Notify Builder]
    Dashboard --> OrgMgmt[Organization Mgmt]
    Dashboard --> UserMgmt[User Mgmt]
    Dashboard --> Monitoring
    Dashboard --> AuditLog[Audit Log]
    Dashboard --> Settings
```

---

## 4. Builder Portal Screen Flow

```mermaid
flowchart LR
    Login --> Dashboard
    Dashboard --> Projects
    Projects --> ProjectDetail[Project Detail]
    ProjectDetail --> Units
    Units --> UnitDetail[Unit Detail]
    UnitDetail --> OwnerAssignment[Owner Assignment]
    UnitDetail --> DocUpload[Document Upload]
    OwnerAssignment --> Invitations
    Invitations -->|Accepted| Handover[Handover Complete\nreflected in Unit Detail]
    Invitations -->|Declined/Expired| OwnerAssignment
    Dashboard --> DocsLibrary[Documents Library]
    Dashboard --> Reports
    Dashboard --> Notifications
    Dashboard --> Settings
```

---

## 5. Invitation Flow (screen-level)

```mermaid
sequenceDiagram
    participant BA as Builder (BA-06/BA-09)
    participant Sys as System
    participant OA as Owner Mobile App

    BA->>Sys: Send invitation (from Unit Detail)
    Sys->>OA: Deliver invitation link
    OA->>OA: Account activation (if new) or login
    OA->>OA: Property acceptance review (OA-REF-02)
    alt Accept
        OA->>Sys: Accept
        Sys->>BA: Update Unit Detail + Invitations status
    else Decline/Expire
        Sys->>BA: Update Unit Detail + Invitations status
        BA->>BA: Reassign (BA-07)
    end
```

---

## 6. Property Handover Flow (screen-level)

```mermaid
flowchart LR
    UnitDetail[BA-06 Unit Detail] --> Assign[BA-07 Owner Assignment]
    Assign --> Upload[BA-08 Document Upload]
    Upload --> Invite[BA-09 Invitations]
    Invite --> OwnerReview[OA-REF-02 Property Acceptance\nreference only]
    OwnerReview -->|Accept| OwnerDocs[OA-REF-03 Property Documents]
    OwnerReview -->|Decline| UnitDetail
```

---

## 7. Owner Activation Flow (screen-level, reference only)

```mermaid
flowchart LR
    Invite[BA-09 Invitation Sent] --> Notif[Owner receives notification]
    Notif --> Activate[OA-REF-01 Account Activation\nexisting, unmodified]
    Activate --> Review[OA-REF-02 Property Acceptance\nnew, mobile-side, out of this doc's scope]
    Review -->|Accept| Existing[OA-REF-03/04/05\nexisting app, unchanged]
```

---

## 8. High-Level Screen Relationships

```mermaid
flowchart TB
    PublicWebsite[Public Website\n9 screens] -->|Builder Registration| SuperAdmin[Super Admin Portal\n11 screens]
    SuperAdmin -->|Approval provisions access| BuilderPortal[Builder Handover Portal\n13 screens]
    BuilderPortal -->|Invitation + Handover| OwnerApp[Owner Mobile App\n5 reference points, unmodified]
    SuperAdmin -.ongoing monitoring/support.-> BuilderPortal
    SuperAdmin -.ongoing monitoring/support.-> OwnerApp
```

---

## 9. Screen Hierarchy (tree)

```mermaid
flowchart TB
    Root[MyPropertyAsset Web Platform]
    Root --> PW[Public Website]
    Root --> SA[Super Admin Portal]
    Root --> BA[Builder Handover Portal]
    Root -.reference only.-> OA[Owner Mobile App]

    PW --> PW1[Home / Features / Pricing / About / FAQ]
    PW --> PW2[Contact Sales / Demo Request / Builder Registration]
    PW --> PW3[Login Gateway]

    SA --> SA1[Login / Dashboard]
    SA --> SA2[Builder Mgmt / Detail & Approval]
    SA --> SA3[Organization / White-label / Subscription]
    SA --> SA4[User Mgmt / Monitoring / Audit / Settings]

    BA --> BA1[Login / Dashboard]
    BA --> BA2[Projects / Project Detail / Units / Unit Detail]
    BA --> BA3[Owner Assignment / Document Upload]
    BA --> BA4[Invitations / Documents Library / Reports]
    BA --> BA5[Notifications / Settings]
```
