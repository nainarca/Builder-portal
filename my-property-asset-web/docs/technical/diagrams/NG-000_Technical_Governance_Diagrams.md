# NG-000 — Technical Governance Diagrams

**Companion to:** [`../NG-000_Web_Platform_Technical_Governance.md`](../NG-000_Web_Platform_Technical_Governance.md)

---

## 1. Technical Governance Model

```mermaid
flowchart TB
    Business["Business Architecture\n(A-001–A-009)"] --> Governance["Technical Governance\n(NG-000, this document)"]
    Governance --> Standards["TECHNICAL_STANDARDS / CODING_STANDARDS /\nREPOSITORY_STANDARDS / QUALITY_GATES"]
    Governance --> AIGuide["AI_DEVELOPMENT_GUIDE"]
    Standards --> Future["NG-001 through NG-009, UI-001, API-001"]
    AIGuide --> Future
    Future --> Implementation["Cursor AI Implementation\n(only from Approved documents)"]
```

---

## 2. Architecture Governance Flow

```mermaid
flowchart LR
    Idea[Business Need] --> ADoc["A-series document\n(business architecture)"]
    ADoc --> Review["Review Checklist"]
    Review --> Approval{Human Approves?}
    Approval -->|No| ADoc
    Approval -->|Yes| NGDoc["NG-series document\n(technical architecture)"]
    NGDoc --> NGReview["Review Checklist"]
    NGReview --> NGApproval{Human Approves?}
    NGApproval -->|No| NGDoc
    NGApproval -->|Yes| Code[Cursor AI Implementation]
```

---

## 3. Development Workflow

```mermaid
flowchart LR
    Branch["Short-lived feature branch\n(trunk-based)"] --> Code[Write code / Cursor AI generates]
    Code --> Gates["Quality Gates\n(lint, types, tests, RLS negative-tests)"]
    Gates -->|Fail| Code
    Gates -->|Pass| PR[Pull Request]
    PR --> Review["Independent Human Review\n(same bar for AI-generated code)"]
    Review -->|Changes requested| Code
    Review -->|Approved| Merge[Merge to main]
    Merge --> Staging[Continuous deploy to Staging]
    Staging --> Gate2{Production Readiness Checklist}
    Gate2 -->|Not met| Staging
    Gate2 -->|Met| Prod[Gated Production Release]
```

---

## 4. Approval Workflow

```mermaid
flowchart TB
    Draft[Document: Draft] --> ReviewChecklist[Review Checklist completed]
    ReviewChecklist --> HumanReview{Human Reviewer Sign-off}
    HumanReview -->|Rejected| Draft
    HumanReview -->|Approved| ApprovalChecklist[Approval Checklist completed]
    ApprovalChecklist --> Approved["Status: Approved\n(only NOW may Cursor AI implement from it)"]
```

---

## 5. Quality Gate Flow

```mermaid
flowchart LR
    Change[Code Change] --> Lint{Lint Pass?}
    Lint -->|No| Fail1[Blocked]
    Lint -->|Yes| Types{Type-check Pass?}
    Types -->|No| Fail2[Blocked]
    Types -->|Yes| Tests{Unit + RLS/RBAC\nnegative tests Pass?}
    Tests -->|No| Fail3[Blocked]
    Tests -->|Yes| Security{No critical/high\nsecurity finding?}
    Security -->|No| Fail4[Blocked]
    Security -->|Yes| ADR{New pattern has ADR?}
    ADR -->|No| Fail5[Blocked]
    ADR -->|Yes| ReviewGate{Independent review approved?}
    ReviewGate -->|No| Fail6[Blocked]
    ReviewGate -->|Yes| Merge[Merge Allowed]
```

---

## 6. Repository Governance

```mermaid
flowchart TB
    Main["main (protected)"] -->|feature branch| F1[Short-lived branch A]
    Main -->|feature branch| F2[Short-lived branch B]
    F1 -->|PR + Quality Gates| Main
    F2 -->|PR + Quality Gates| Main
    Main --> Staging[Continuous Deploy: Staging]
    Staging --> ProdGate{Production Readiness Checklist}
    ProdGate --> Prod[Production]

    subgraph "Separate repositories — never merged"
        WebRepo["my-property-asset-web\n(this platform)"]
        FlutterRepo["my_property_asset\n(existing Flutter app — untouched)"]
    end
```

---

## 7. AI Collaboration Workflow

```mermaid
sequenceDiagram
    participant Human as Human Stakeholder
    participant Claude as Claude (Architecture)
    participant Cursor as Cursor AI (Implementation)

    Human->>Claude: Business/technical need
    Claude->>Claude: Read prior approved docs, pre-check, flag conflicts
    Claude->>Human: Draft document + Review Checklist
    Human->>Claude: Review feedback (iterate if needed)
    Human->>Human: Complete Approval Checklist
    Note over Human: Document status: Draft → Approved
    Human->>Cursor: Approved document
    Cursor->>Cursor: Generate code strictly from approved spec
    Cursor->>Human: Pull Request + traceability reference
    Human->>Human: Independent review (Quality Gates)
    Human->>Cursor: Merge (or request changes)
```
