# A-003 — User Journey Diagrams

**Companion to:** [`../A-003_User_Journey.md`](../A-003_User_Journey.md)
**Purpose:** All diagrams referenced by A-003, kept separate from the journey analysis per this document's own deliverable structure.

---

## 1. User Journey Map (all actors, high level)

```mermaid
flowchart TB
    subgraph Visitor
        V1[Discover] --> V2[Explore] --> V3[Compare/Pricing] --> V4{Owner or Builder track?}
    end
    V4 -->|Owner| OSignup[Direct Signup\nexisting flow]
    V4 -->|Builder| BReg[Submit Builder Registration]

    subgraph "Super Admin"
        SA1[Review Registration] --> SA2[Approve/Reject]
        SA2 -->|Approve| SA3[White-label Config]
        SA3 --> SA4[Subscription Activation]
        SA4 --> SA5[Organization Confirmed]
    end
    BReg --> SA1

    subgraph Builder
        B1[Login] --> B2[Create Project/Units]
        B2 --> B3[Assign Owner]
        B3 --> B4[Upload Documents]
        B4 --> B5[Invite Owner]
    end
    SA5 --> B1

    subgraph Owner
        O1[Receive Invitation] --> O2[Activate Account]
        O2 --> O3[Review + Accept Handover]
        O3 --> O4[Existing App: Property/Loan/Expense/Tenant/Financial History]
    end
    B5 --> O1
    O3 -.declined.-> B3
```

---

## 2. Customer Journey Map (Public Visitor, emotional/experience layer)

```mermaid
journey
    title Public Visitor Journey
    section Discover
      Find via search or referral: 4: Visitor
      Land on homepage: 3: Visitor
    section Evaluate
      Explore features: 4: Visitor
      Compare to current process: 3: Visitor
      Check pricing: 3: Visitor
    section Decide
      Request demo / contact sales: 3: Visitor
      Sign up (owner) or Register (builder): 5: Visitor
    section Exit
      Convert or leave undecided: 4: Visitor
```

---

## 3. Builder Journey

```mermaid
flowchart LR
    Login --> Dashboard
    Dashboard --> CreateProject[Create Project]
    CreateProject --> CreateUnits[Create Units]
    CreateUnits --> AssignOwner[Assign Owner]
    AssignOwner --> UploadDocs[Upload Initial Documents]
    UploadDocs --> Invite[Invite Owner]
    Invite --> TrackInvite{Invitation Status}
    TrackInvite -->|Accepted| TrackHandover[Track Handover Complete]
    TrackInvite -->|Declined/Expired| Reassign[Reassign Unit]
    Reassign --> AssignOwner
    TrackHandover --> Reports
    Reports --> Logout
```

---

## 4. Owner Journey

```mermaid
flowchart LR
    Receive[Receive Invitation] --> Activate[Activate Account]
    Activate --> Review[View Property / Review Package]
    Review --> Decision{Accept?}
    Decision -->|Yes| Accept[Accept Handover]
    Decision -->|No| Decline[Decline]
    Accept --> Docs[Access Initial Documents]
    Docs --> Upload[Upload Personal Documents]
    Upload --> Existing[Add Loan / Expenses / Tenant]
    Existing --> Financial[View Financial History]
    Financial --> Profile[Profile / Settings]
    Profile --> Logout
    Decline -.-> ReturnToBuilder[Unit returns to Builder queue]
```

---

## 5. Super Admin Journey

```mermaid
flowchart LR
    Login --> Dashboard
    Dashboard --> Review[Review Builder Registration]
    Review --> Decision{Approve?}
    Decision -->|Yes| Whitelabel[Configure White-label]
    Decision -->|No| Reject[Reject + Notify]
    Whitelabel --> Subscription[Activate Subscription]
    Subscription --> OrgManage[Manage Organizations]
    OrgManage --> Monitor[Monitor Platform]
    Monitor --> Support[Support Builders]
    Support --> Logout
```

---

## 6. Invitation Journey (Owner Invitation, detail)

```mermaid
sequenceDiagram
    participant Builder
    participant System
    participant Owner

    Builder->>System: Invite Owner (unit + email)
    System->>System: Generate token, set expiry
    System->>Owner: Deliver invitation
    alt Owner has no account
        Owner->>System: Sign up + activate
    else Owner has an account
        Owner->>System: Log in
    end
    Owner->>System: Review handover package
    alt Accept
        Owner->>System: Accept
        System->>Builder: Notify accepted
    else Decline or Expire
        System->>Builder: Notify declined/expired
        Builder->>System: Reassign (optional)
    end
```

---

## 7. Handover Journey (Property + Document transfer, detail)

```mermaid
stateDiagram-v2
    [*] --> BuilderOwned: Documents uploaded, unit assigned
    BuilderOwned --> Invited: Owner invited
    Invited --> Accepted: Owner accepts
    Invited --> NeedsReassignment: Declined / expired
    NeedsReassignment --> BuilderOwned: Reassigned
    Accepted --> OwnerOwned: Documents + property transfer\n(same record, not a copy)
    OwnerOwned --> [*]: Existing Owner Mobile App lifecycle
```

---

## 8. Notification Journey (cross-actor)

```mermaid
flowchart TB
    Reg[Builder Registration submitted] --> N1[Notify: Super Admin]
    Approve[Builder Approved/Rejected] --> N2[Notify: Builder]
    Invite[Owner Invited] --> N3[Notify: Owner]
    Expire[Invitation Expiring/Expired] --> N4[Notify: Builder]
    AcceptDecline[Owner Accepts/Declines] --> N5[Notify: Builder]
    Handover[Handover Complete] --> N6[Notify: Owner + Builder]
    Existing[Existing in-app triggers\nEMI due, rent due, doc expiry] --> N7[Notify: Owner\nunchanged, existing capability]
```

---

## 9. Journey Swimlane Diagram (full cross-actor flow)

```mermaid
flowchart TB
    subgraph "Public Visitor"
        direction LR
        PV1[Discover/Explore] --> PV2[Register as Builder]
    end
    subgraph "Super Admin"
        direction LR
        SA1[Approve Builder] --> SA2[White-label + Subscription] --> SA3[Monitor/Support]
    end
    subgraph "Builder"
        direction LR
        B1[Create Project/Unit] --> B2[Upload Docs] --> B3[Invite Owner] --> B4[Track Handover]
    end
    subgraph "Owner"
        direction LR
        O1[Activate Account] --> O2[Accept Handover] --> O3[Existing App Use]
    end

    PV2 --> SA1
    SA2 --> B1
    B3 --> O1
    O2 --> B4
```
