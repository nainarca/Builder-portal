# NG-014 — Review Diagrams

**Companion to:** [`../NG-014_Technical_Architecture_Review.md`](../NG-014_Technical_Architecture_Review.md)

---

## 1. Architecture Dependency Graph

```mermaid
flowchart TB
    A001["A-001 Vision"] --> A002["A-002 Business Flow"] --> A003["A-003 Journey"] --> A003A["A-003A Stories"] --> A004["A-004 Screens"] --> A005["A-005 Nav"]
    A005 -.MISSING.-> A006["A-006 Modules\n(does not exist)"]
    A006 -.provisional bridge.-> A007["A-007 Info Arch"]
    A005 -.direct, bridged.-> A007
    A007 --> A008["A-008 RBAC"] --> A009["A-009 Review"]
    A009 --> NG000["NG-000 Governance"]
    NG000 --> NG001through013["NG-001 → NG-013\n(strictly sequential, no cycles)"]

    style A006 fill:#eee,stroke-dasharray: 5 5
```

---

## 2. Business → Technical Traceability

```mermaid
flowchart LR
    subgraph Business["Business Architecture"]
        direction TB
        BV["Vision"] --> BF["Flow"] --> UJ["Journey"] --> US["Stories"] --> SF["Screens"] --> NAV["Navigation"]
        NAV -.gap.-> FM["Functional Modules — MISSING"]
        FM -.bridged.-> IA["Info Architecture"]
        IA --> RBAC["RBAC"]
    end
    subgraph Technical["Technical Architecture"]
        direction TB
        AA["Angular Arch"] --> WS["Workspace"] --> LIB["Libraries"] --> RT["Routing"] --> ST["State"] --> AUTH["Auth"] --> API["API"] --> FS["Folders"] --> PERF["Performance"] --> LOG["Logging"] --> DEP["Deployment"] --> TEST["Testing"] --> PRES["Presentation"]
    end
    RBAC --> AA
```

---

## 3. Implementation Readiness Flow

```mermaid
flowchart TB
    Phase0["Phase 0 — Governance unblock\n(Approval Checklist, MASTER_CONTEXT.md)"] --> Phase1["Phase 1 — Cross-cutting foundation\n(workspace, libraries, auth)"]
    Phase1 --> Phase2["Phase 2 — Public Website"]
    Phase1 --> Phase3["Phase 3 — Super Admin\n(non-Builder-data)"]
    Phase2 & Phase3 --> Phase4{"Builder Portal\noperational core"}
    Phase4 -->|A-006 + backend domain resolved| Phase4Build["Build Builder Portal core"]
    Phase4 -->|Not resolved| Blocked["Remains toggled off\n(infra-feature-flags)"]
    Phase1 -.throughout, not final.-> Phase5["CI/CD + Testing\n(shift-left, concurrent)"]
```

---

## 4. Architecture Governance Model

```mermaid
flowchart TB
    Claude["Claude — Architecture & Documentation\n(never writes production code)"] --> Docs["A-series + NG-series\n(Markdown only)"]
    Docs --> Human["Human stakeholder — Approval\n(the ONLY approval mechanism, no AI self-approval)"]
    Human -->|Approved| CursorAI["Cursor AI — Implementation\n(only from Approved docs)"]
    Human -.currently: 0 of 23 approved.-> Blocked["Implementation gated,\nnot yet authorized"]
    CursorAI --> Review["Human code review\n(same rigor as human-written code)"]
```

---

## 5. Technical Dependency Diagram

```mermaid
flowchart LR
    NG000["NG-000 Governance"] --> NG001["NG-001 Angular Arch"]
    NG001 --> NG002["NG-002 Workspace"]
    NG002 --> NG003["NG-003 Libraries"]
    NG003 --> NG004["NG-004 Routing"]
    NG004 --> NG005["NG-005 State"]
    NG005 --> NG006["NG-006 Auth"]
    NG006 --> NG007["NG-007 API"]
    NG007 -.external.-> Backend["my_property_asset backend\n(3/10 domains specified)"]
    NG007 --> NG008["NG-008 Folders"]
    NG008 --> NG009["NG-009 Performance"]
    NG009 --> NG010["NG-010 Logging"]
    NG010 --> NG011["NG-011 Deployment"]
    NG011 --> NG012["NG-012 Testing"]
    NG012 --> NG013["NG-013 Presentation"]
    NG013 --> NG014["NG-014 This Review"]
```
