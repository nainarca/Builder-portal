# NG-006 — Security Diagrams

**Companion to:** [`../NG-006_Authentication_Authorization_Architecture.md`](../NG-006_Authentication_Authorization_Architecture.md)

---

## 1. Authentication Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> Authenticating: Submit credentials
    Authenticating --> Authenticated: Supabase Auth validates
    Authenticating --> Unauthenticated: Invalid credentials
    Authenticated --> Authenticated: Silent token refresh
    Authenticated --> Unauthenticated: Logout — ALL Core state cleared
    Authenticated --> Unauthenticated: Session expiry
```

---

## 2. Authorization Flow

```mermaid
flowchart TB
    AuthCtx[Authentication Context] --> OrgCtx[Organization Context]
    OrgCtx --> UserCtx[User Context — role]
    UserCtx --> PermResolve["Permission Resolution\n(PERMISSION_MATRIX.md)"]
    PermResolve --> PermSet[Resolved Permission Set — one Signal]
    PermSet --> RouteGuard[Route Guards]
    PermSet --> MenuVis[Menu Visibility]
    PermSet --> FeatureGate[Feature-load Gates]
```

---

## 3. Identity Flow

```mermaid
flowchart LR
    SuperAdmin["Super Admin\n(out-of-band provisioning)"] --> AuthCtx1[Authentication Context]
    BuilderInvite["Builder — invited via\nA-002 §7 approval flow"] --> AuthCtx2[Authentication Context]
    BuilderTeamInvite["Builder team member — invited via\norganization_invitations (backend)"] --> AuthCtx3[Authentication Context]
    Owner["Property Owner\n(Flutter app, separate entirely)"] -.no connection to this platform's auth.-> Separate[Owner's own Supabase Auth session]
```

---

## 4. Organization Context Flow

```mermaid
flowchart TB
    Login[Login] --> AuthOK{Authenticated?}
    AuthOK -->|Yes, Builder Portal| SingleOrg["Organization Context = session's ONE Organization\n(ADR-011, fixed for session lifetime)"]
    AuthOK -->|Yes, Super Admin| NoSingleOrg["No 'my Organization' — Internal-classification\ncross-Org views by default"]
    NoSingleOrg -.optional, explicit, time-boxed.-> SupportAccess["Support Access grant\n(extends permission set, ONE Organization,\nnever Restricted-Financial)"]
```

---

## 5. Permission Resolution Flow

```mermaid
sequenceDiagram
    participant Session
    participant RBAC as shared-rbac
    participant Matrix as PERMISSION_MATRIX.md (A-008)

    Session->>RBAC: Authentication Context + Organization Context + User Context
    RBAC->>Matrix: Look up applicable row(s)
    Matrix-->>RBAC: Permission levels (Full/Operate/Contribute/Decide/Read/Own-Read/None/Delegated)
    RBAC->>RBAC: Compose into one resolved Signal
    RBAC-->>Session: Permission Set Signal (single source, consumed everywhere)
```

---

## 6. Session Lifecycle

```mermaid
flowchart LR
    Created[Session Created — Login] --> Active[Active — silent refresh]
    Active --> Active
    Active --> Expired[Expired — re-authenticate]
    Active --> LoggedOut[Logout — Core state cleared]
    Expired --> Created
    LoggedOut --> Created
```

---

## 7. Token Lifecycle

```mermaid
flowchart LR
    Issue[JWT Issued at Login] --> Use[Attached to every Supabase call]
    Use --> Refresh{Refresh needed?}
    Refresh -->|Silent, automatic| Use
    Refresh -->|Refresh fails| ReAuth[Prompt re-authentication\nnever silent retry loop]
    Use --> Invalidate[Invalidated at Logout]
```

---

## 8. Security Context Diagram

```mermaid
flowchart TB
    subgraph "Public Visitor — all four layers absent"
        None[No context of any kind]
    end
    subgraph "Builder Session"
        BA1[Authentication Context] --> BA2["Organization Context\n(1 Org, fixed — ADR-011)"]
        BA2 --> BA3[User Context — Owner/Admin/Member]
        BA3 --> BA4[Permission Set]
    end
    subgraph "Super Admin Session"
        SA1[Authentication Context] --> SA2["Organization Context\n(none — cross-Org, Internal-classification)"]
        SA2 --> SA3[User Context — Super Admin]
        SA3 --> SA4[Permission Set]
        SA4 -.optional extension.-> SA5["+ Support Access\n(1 Org, time-boxed, audited,\nNEVER Restricted-Financial)"]
    end
```

---

## 9. RBAC Integration

```mermaid
flowchart TB
    PermMatrix["PERMISSION_MATRIX.md (A-008)\n— the only source of truth"] --> RBAC[shared-rbac — the only reader]
    RBAC --> RouteGuards[Route Guards]
    RBAC --> Menus[Menu Visibility]
    RBAC --> FeatureGates[Feature-load Gates]
    RouteGuards -.UX only.-> RLS[(Supabase RLS —\nthe real enforcement)]
    FeatureGates -.UX only.-> RLS
```

---

## 10. Route Protection Model

```mermaid
flowchart TB
    Route[Requested Route] --> Check1{1. Authentication Context valid?}
    Check1 -->|No| Login[Redirect to /login]
    Check1 -->|Yes| Check2{"2. Organization Context resolved?\n(Builder Portal / Super Admin only)"}
    Check2 -->|No| Wait[Bootstrap not complete — hold]
    Check2 -->|Yes| Check3{3. Permission Set permits this route?}
    Check3 -->|No| Unauthorized[Unauthorized state — NOT 404]
    Check3 -->|Yes| Render[Render route]
    Render -.independently re-checked at.-> RLS[(Supabase RLS)]
```
