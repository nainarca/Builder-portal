# NG-011 — Deployment Diagrams

**Companion to:** [`../NG-011_Build_Release_Deployment_Architecture.md`](../NG-011_Build_Release_Deployment_Architecture.md)

---

## 1. Build Pipeline

```mermaid
flowchart LR
    PR["Pull Request"] --> CIPr["CI: lint, type-check,\nunit + RLS/RBAC tests,\nsecurity scan"]
    CIPr -->|pass| Merge["Merge to main"]
    Merge --> CIMerge["CI: full QUALITY_GATES.md\n+ Performance Budget check"]
    CIMerge -->|pass| Artifact["Immutable, versioned,\nfingerprinted artifact\n(ADR-017)"]
    CIMerge -->|fail| Reject["Build invalid — not promotable"]
```

---

## 2. CI/CD Pipeline

```mermaid
flowchart TB
    Artifact["Immutable artifact\n(one per application)"] --> QA["QA — automatic deploy"]
    QA --> QAValidate["Automated integration/RLS suite"]
    QAValidate -->|pass| UAT["UAT — gated"]
    UAT --> UATSignoff["Human business sign-off"]
    UATSignoff -->|approved| Staging["Staging — gated"]
    Staging --> StagingValidate["Final production-shaped validation"]
    StagingValidate -->|pass| Production["Production — gated,\nnever automatic"]
```

---

## 3. Release Workflow

```mermaid
flowchart TB
    Feature["Feature branch\n(short-lived)"] -->|PR + gates pass| Main["main (trunk, ADR-006)"]
    Main --> Candidate["Release candidate\n= any gate-passing commit on main"]
    Candidate --> Pipeline["Promotion pipeline\n(Diagram 2)"]
    UATDefect["UAT-discovered defect,\nunrelated commits since merged"] -.rare case.-> ReleaseBranch["Short-lived release branch\ncut from main"]
    ReleaseBranch --> FixBack["Fix merged back to main too"]
```

---

## 4. Environment Promotion Flow

```mermaid
flowchart LR
    Dev["Development\n(pre-merge, ephemeral)"] -.not part of promotion pipeline.-> QA
    QA["QA\n(auto-deploy on merge)"] --> UAT["UAT\n(human sign-off)"]
    UAT --> Staging["Staging\n(production-shaped)"]
    Staging --> Prod["Production\n(gated, deliberate)"]

    QA -.own Supabase project.-> SupaQA[(Supabase — QA)]
    UAT -.own Supabase project.-> SupaUAT[(Supabase — UAT)]
    Staging -.own Supabase project.-> SupaStaging[(Supabase — Staging)]
    Prod -.own Supabase project.-> SupaProd[(Supabase — Production)]
```

---

## 5. Deployment Workflow

```mermaid
flowchart TB
    Approved["Artifact approved for this tier"] --> BlueGreen["Deploy alongside currently-live version\n(Blue/Green, ADR-018)"]
    BlueGreen --> Smoke["Automated smoke check\n(Shell bootstrap + RLS read)"]
    Smoke -->|pass| Cutover["Atomic traffic cutover"]
    Smoke -->|fail| AutoRollback["Automatic rollback —\nnever cut over"]
    Cutover --> PostMonitor["Heightened post-deployment\nmonitoring window"]
```

---

## 6. Rollback Workflow

```mermaid
flowchart TB
    Trigger{"Rollback trigger"}
    Trigger -->|Failed smoke check| Auto["Automatic rollback"]
    Trigger -->|Post-deploy metric regression| Auto
    Trigger -->|Manually discovered defect| Manual["Manual rollback decision"]
    Auto --> Redeploy["Redeploy immediately-prior\nimmutable artifact"]
    Manual --> Redeploy
    Redeploy --> NoRebuild["No rebuild, no CI re-run —\nalready validated once"]
```

---

## 7. Version Lifecycle

```mermaid
flowchart LR
    Commit["Commit merged to main,\ngates pass"] --> Build["Build — version assigned once\n(VERSIONING_POLICY.md §6)"]
    Build --> Promote["Version travels unchanged\nthrough every environment tier"]
    Promote --> Deployed["Deployed to Production\nwith its original version"]
    Deployed -.if rolled back.-> PriorVersion["Prior version redeployed —\nnot a new version"]
```

---

## 8. Branch Strategy

```mermaid
flowchart TB
    Main["main — the only long-lived branch\n(ADR-006, trunk-based)"]
    Main --> Feature["Feature branches — short-lived,\nmerge back via PR"]
    Main -.rare.-> ReleaseBranch["Release branch — short-lived,\ncut only for UAT-stage fixes,\nmerged back to main"]
    ProdTag["Production tag/commit"] -.rare.-> Hotfix["Hotfix branch — short-lived,\ncut from Production, not main"]
    Hotfix --> Main

    NoGitFlow["NO long-lived develop/release branches"]
    style NoGitFlow fill:#eee,stroke-dasharray: 5 5
```
