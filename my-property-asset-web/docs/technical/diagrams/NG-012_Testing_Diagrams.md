# NG-012 — Testing Diagrams

**Companion to:** [`../NG-012_Quality_Engineering_Testing_Architecture.md`](../NG-012_Quality_Engineering_Testing_Architecture.md)

---

## 1. Quality Engineering Lifecycle

```mermaid
flowchart LR
    Spec["A-003A / PERMISSION_MATRIX.md / A-002\n(source of truth)"] --> Write["Test written, traced to source"]
    Write --> Automate["Automated in CI\n(TEST_AUTOMATION_STRATEGY.md)"]
    Automate --> Gate["Quality Gates\n(TEST_QUALITY_GATES.md §29)"]
    Gate --> Release["Release Readiness\n(§30)"]
    Release --> Monitor["Post-deployment monitoring\n(NG-009/NG-010)"]
    Monitor -.defect found.-> Lifecycle["Defect Lifecycle §31"]
    Lifecycle --> Write
```

---

## 2. Testing Pyramid

```mermaid
flowchart TB
    E2E["E2E — fewest\ncritical cross-product flows only"]
    Integration["Integration — RLS/RBAC boundary,\nAPI contract (100% of PERMISSION_MATRIX 'None' cells)"]
    UnitComponent["Unit + Component — most\nbusiness logic, components"]

    UnitComponent --> Integration --> E2E
```

---

## 3. CI Testing Flow

```mermaid
flowchart TB
    PR["Pull Request"] --> Lint["Lint + type-check\n(TEST_AUTOMATION_STRATEGY.md §25)"]
    Lint --> Unit["Unit + Component tests"]
    Unit --> Static["Static analysis\n(dependency scan + Restricted-Financial\nstructural check §24)"]
    Static --> Merge["Merge to main"]
    Merge --> Integration["Integration/RLS suite\n(against QA Supabase project)"]
    Integration --> E2E["E2E suite\n(critical flows)"]
    E2E --> Artifact["Promotable artifact\n(NG-011)"]
```

---

## 4. Release Quality Gates

```mermaid
flowchart LR
    Build["Build Validation\n(NG-011 §18)"] --> QAGate["QA gate —\nIntegration/RLS 100% + coverage floors"]
    QAGate --> UATGate["UAT gate —\nhuman sign-off + white-label/multi-org check"]
    UATGate --> StagingGate["Staging gate —\nperformance validation"]
    StagingGate --> ProdGate["Production gate —\nnever automatic"]
```

---

## 5. Defect Lifecycle

```mermaid
flowchart LR
    Detected["Detected —\ngate, UAT, or monitoring signal"] --> Classified["Classified —\nSeverity × Category (ERROR_CLASSIFICATION.md)"]
    Classified --> Fixed["Fixed —\nnew commit, never a patched artifact"]
    Fixed --> Verified["Verified —\nregression test included in the fix"]
    Verified --> Closed["Closed —\npasses every gate + sanity check if Production-discovered"]
```

---

## 6. Automation Architecture

```mermaid
flowchart TB
    subgraph CI["CI (per application, Nx-affected-aware)"]
        LintCI["Lint / type-check"]
        UnitCI["Unit + Component"]
        StaticCI["Static analysis"]
        IntegrationCI["Integration/RLS"]
        E2ECI["E2E"]
    end
    CI --> Gates["TEST_QUALITY_GATES.md §29"]
    Gates --> Block{"All pass?"}
    Block -->|No| BlockPipeline["Pipeline blocked — no downgrade to warning"]
    Block -->|Yes| Promote["Promotable"]
```

---

## 7. Test Environment Flow

```mermaid
flowchart LR
    UnitComp["Unit / Component"] -.no deployed env.-> CIExecutor["CI executor only"]
    Integration["Integration/RLS"] --> QAEnv["QA — real Supabase project"]
    E2E["E2E"] --> QAOrStaging["QA or Staging"]
    UAT["UAT sign-off"] --> UATEnv["UAT tier"]
    Perf["Performance validation"] --> StagingEnv["Staging tier"]
    Smoke["Smoke / Sanity"] --> WhicheverDeployed["Whichever tier just deployed"]

    NoProd["NEVER Production"]
    style NoProd fill:#eee,stroke-dasharray: 5 5
```

---

## 8. Quality Approval Workflow

```mermaid
flowchart TB
    Automated["Every automated gate passes\n(§29)"] --> HumanReview["Independent human code review\n(CODING_STANDARDS.md §30)"]
    HumanReview --> UATSignoff["UAT human sign-off\n(§8, includes accessibility/white-label spot-check)"]
    UATSignoff --> StagingValidate["Staging technical validation"]
    StagingValidate --> ProdApproval["Production approval —\ndistinct, non-delegable decision\n(RELEASE_STRATEGY.md §30)"]
```
