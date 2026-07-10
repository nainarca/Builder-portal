# NG-009 — Performance Diagrams

**Companion to:** [`../NG-009_Performance_Scalability_Architecture.md`](../NG-009_Performance_Scalability_Architecture.md)

---

## 1. Performance Architecture

```mermaid
flowchart TB
    Standalone["ADR-001 Standalone Components"] --> Zoneless["ADR-014 Zoneless Change Detection"]
    Signals["ADR-004 Signals"] --> Zoneless
    Zoneless --> OnPush["OnPush rendering, fine-grained reactivity"]
    OnPush --> Perf["Performance Strategy\n(PERFORMANCE_STRATEGY.md)"]
    Bundle["Bundle Strategy"] --> Perf
    Cache["Cache Performance"] --> Perf
    Perf --> CWV["Core Web Vitals Targets\nLCP < 2.5s, INP < 200ms, CLS < 0.1"]
```

---

## 2. Bundle Strategy

```mermaid
flowchart TB
    subgraph PublicWebsite["public-website (SSR + prerender, <300KB initial)"]
        PW1[Core/Infra/Theme - eager]
        PW2[marketing-conversion - lazy]
    end
    subgraph SuperAdmin["super-admin (CSR, <500KB initial)"]
        SA1[Core/Infra/Theme - eager]
        SA2["builder-onboarding, tenancy-branding,\ncommercial, operations, audit,\nusers, dashboard, settings,\ncommunication - each lazy, <250KB"]
    end
    subgraph BuilderPortal["builder-portal (CSR, <500KB initial)"]
        BP1[Core/Infra/Theme - eager]
        BP2["projects, units, documents,\ninvitations, reporting, dashboard,\nsettings, communication - each lazy, <250KB"]
    end
```

---

## 3. Loading Strategy

```mermaid
flowchart LR
    Nav["Route navigation"] --> Preload{"Predicted next feature?\n(BUNDLE_STRATEGY.md §7)"}
    Preload -->|Yes| PreloadChunk["Preload chunk in background"]
    Preload -->|No| WaitNav["Wait for actual navigation"]
    WaitNav --> LazyLoad["Lazy-load feature chunk on navigation"]
    PreloadChunk --> Render["Render feature"]
    LazyLoad --> Render
    Render --> DataFetch["Feature fetches its own data\n(never prefetched)"]
```

---

## 4. Caching Strategy

```mermaid
flowchart TB
    Fetch["Repository fetch\n(narrow, paginated)"] --> SignalCache["Owning Feature/Core Signal\n(the cache, CACHE_STRATEGY.md)"]
    SignalCache --> Read["Synchronous template read\n(no lookup latency)"]
    Mutation["Mutation succeeds"] --> Invalidate["Explicit invalidation"]
    Invalidate --> SignalCache
    NoWarm["No cache warm-up / no background polling"]
    style NoWarm fill:#eee,stroke-dasharray: 5 5
```

---

## 5. Scalability Model

```mermaid
flowchart TB
    Static["Stateless static bundle\n(per application)"] --> CDNEdge["CDN edge nodes\n(horizontal scale = more edges)"]
    CDNEdge --> Users["Users, any volume"]
    Static -.no server-side session state.-> NoAffinity["No sticky sessions needed"]
    Backend["Supabase backend scaling"] -.out of this document's scope.-> Static
    OrgScale["Organization count grows"] -.never grows per-request cost.-> BoundedQuery["Every query already\nOrganization-scoped + paginated"]
```

---

## 6. Asset Delivery Model

```mermaid
flowchart TB
    SharedAssets["Shared assets\n(libs/shared/ui/assets)"] --> Hash["Content-hashed at build"]
    AppAssets["App-specific assets"] --> Hash
    Hash --> CDN["CDN, long max-age\n(safe — hash changes on content change)"]

    OrgBranding["Organization branding\n(Supabase Storage, signed URL)"] -.NEVER CDN-cached.-> Runtime["Fetched at runtime,\nbounded expiry"]
```

---

## 7. Realtime Architecture

```mermaid
flowchart TB
    Reserved["Realtime: reserved, not active\n(REALTIME_STRATEGY.md §14)"] -.if adopted.-> FeatureScope["Subscription scoped to\nactive Feature's route injector"]
    FeatureScope --> Open["Opened when injector created"]
    FeatureScope --> Close["Closed when injector destroyed"]
    NoGlobal["NEVER a workspace-wide or\nOrganization-wide standing subscription"]
    style NoGlobal fill:#eee,stroke-dasharray: 5 5
```

---

## 8. Performance Monitoring Flow

```mermaid
flowchart LR
    RUM["Real User Monitoring\n(Core Web Vitals)"] --> Dashboard["Monitoring Dashboard"]
    CI["CI build\n(bundle size vs budget)"] --> Dashboard
    Logging["infra-logging\n(API latency, error rate)"] --> Dashboard
    SupportAccess["Support Access invocations\n(security + responsiveness KPI)"] --> Dashboard
    Dashboard --> KPIs["Performance KPIs\n(MONITORING_KPIS.md §30)"]
    KPIs --> Review["NG-014 Technical Architecture Review"]
```
