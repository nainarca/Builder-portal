# V1 Architecture Summary

**Version:** 1.0.0  
**Scope:** `my-property-asset-web` (Angular) + Supabase SQL migrations  

## System Context

```
Public Website ──┐
Authentication ──┼── Angular App ── Supabase (Auth/DB/Storage) ── Flutter Owner App (external)
Builder Portal ──┤                     ▲
Super Admin ─────┘                     │
                              SQL migrations (P6–P16)
```

## Architectural Principles (unchanged)

- Portal-first routing with lazy feature modules  
- Core RBAC + organization context  
- Repository abstraction with in-memory V1 implementations  
- SQL-first schema evolution per P5 batches  
- Flutter remains owner of Owner App UX; web provides contracts only  

## Portal Map

| Portal | Responsibility |
|---|---|
| Public website | Marketing, pricing, legal |
| Authentication | Sign-in, invitations |
| Builder Portal | Day-to-day builder operations |
| Super Admin | Platform operations, commercial control |

## Domain Layers Delivered

| Layer | Modules |
|---|---|
| Foundation | P1–P2 auth/org, P6A/P6B SQL |
| Builder business | P7–P12A org/projects/buildings/units/owners/docs/handover |
| Commercial | P13 branding, P14 communications, P15 subscription |
| Platform ops | P16 Super Admin platform |

## Data Access Pattern (V1)

```
Component → Service → Abstract Repository → InMemoryRepository (V1)
                                      ↘ SupabaseRepository (post-V1)
```

## Security Model

- Angular: `authenticatedGuard` + `portalGuard` + `authorizationGuard`  
- RBAC matrix keyed by resource IDs (`id-02` … `id-14`)  
- SQL RLS: strong on early builder tables; incomplete on late commercial tables  

## Non-Goals of V1 Hardening

- No new business modules  
- No architecture redesign  
- No Flutter modifications  
