# A-008 — RBAC Diagrams

**Companion to:** [`../A-008_RBAC.md`](../A-008_RBAC.md)

---

## 1. RBAC Hierarchy

```mermaid
flowchart TB
    SuperAdmin[Super Admin\nplatform-wide, isolated]

    subgraph "Per Builder-type Organization"
        BOwner[Builder Org Owner] --> BAdmin[Builder Org Admin] --> BMember[Builder Org Member]
    end

    subgraph "Per Owner-type Organization"
        OOwner[Owner Org Owner] --> OAdmin["Owner Org Admin (reserved)"] --> OMember["Owner Org Member (reserved)"]
    end

    SuperAdmin -.Support Access only,\ntime-boxed + audited,\nnever reaches ID-13.-> BOwner
```

---

## 2. Permission Relationships

```mermaid
flowchart LR
    Role --> Permission --> Action
    Permission --> Resource["Resource (= A-007 Information Domain)"]
    Resource --> Classification["Classification\n(Public/Internal/Org-Confidential/Restricted-Financial)"]
    Classification -->|Restricted-Financial| NoDelegation["No delegation path exists"]
    Classification -->|Organization-Confidential| SupportAccess["Delegation possible via Support Access"]
```

---

## 3. Organization Isolation Diagram

```mermaid
flowchart TB
    subgraph "Builder Organization A"
        A1[Projects/Units/Documents]
    end
    subgraph "Builder Organization B"
        B1[Projects/Units/Documents]
    end
    subgraph "Owner Organization X"
        X1["Property (ID-13, Restricted-Financial)"]
    end

    A1 -.no access.-> B1
    B1 -.no access.-> A1
    A1 -.no access, ever.-> X1
    B1 -.no access, ever.-> X1

    SuperAdmin[Super Admin] -.Support Access only,\ntime-boxed.-> A1
    SuperAdmin -.Support Access only,\ntime-boxed.-> B1
    SuperAdmin -.NO PATH, no exception.-> X1
```

---

## 4. Ownership Diagram

```mermaid
flowchart LR
    BuilderOrg[Builder Organization] -->|owns until handover| Document[Handover Document ID-09]
    Document -->|transfers at acceptance| OwnerOrg[Owner Organization]
    OwnerOrg -->|owns forever after| Document

    SuperAdminNode[Super Admin] -.administers, does not own.-> Reg[Builder Onboarding ID-02]
    SuperAdminNode -.administers, does not own.-> Ops[Platform Operations ID-06]
```

---

## 5. Resource Access Diagram

```mermaid
flowchart TB
    Resource[Any Resource] --> Check1{Classification?}
    Check1 -->|Public| AllowAll[Any role, including Public Visitor]
    Check1 -->|Internal| CheckSA{Super Admin?}
    CheckSA -->|Yes| Allow[Access granted]
    CheckSA -->|No| Deny[Access denied]
    Check1 -->|Organization-Confidential| CheckOrg{Member of owning Organization?}
    CheckOrg -->|Yes| CheckRole{Role level sufficient?}
    CheckOrg -->|No| CheckDelegate{Super Admin with active Support Access?}
    CheckDelegate -->|Yes| AllowTemp[Access granted, time-boxed + audited]
    CheckDelegate -->|No| Deny
    CheckRole -->|Yes| Allow
    CheckRole -->|No| Deny
    Check1 -->|Restricted-Financial| CheckOwner{Is the record's own Property Owner?}
    CheckOwner -->|Yes| Allow
    CheckOwner -->|No, no exception ever| Deny
```
