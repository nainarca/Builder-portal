# V1 Security Audit

**Date:** 2026-07-16  
**Scope:** Angular web platform + SQL migrations (no Flutter changes)

## Summary

| Area | Rating | Notes |
|---|---|---|
| Authentication shell | Good | Guards on portals |
| Authorization / RBAC | Good | Matrix + permission guards |
| Organization isolation (UI) | Fair | Context-aware; live DB incomplete |
| RLS completeness | Poor–Fair | Early tables OK; B08–B12 missing policies |
| Secrets management | Fair | Anon keys committed (expected public); shared project risk |
| Invitation tokens | Fair | Flows present; live hashing/expiry must be verified on apply |
| Uploads | Fair | Metadata-first; no unrestricted binary gateway in V1 web |

## Verified Controls

1. `authenticatedGuard`, `portalGuard`, `authorizationGuard` on Super Admin and Builder Portal.  
2. `id-06-platform-operations` granted only to `super-admin`.  
3. Builder subscription resource RBAC (Owner operate, Admin read, Staff none).  
4. P6B security SQL foundations present.  
5. Builder-scoped SQL triggers using `is_builder_org` on several tables.

## Findings

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| S1 | Critical | Late migrations lack RLS | Add policies before live wiring |
| S2 | Critical | Units/owners SQL missing while handover references them | Complete schema before apply |
| S3 | High | Shared Supabase across envs | Split projects |
| S4 | High | In-memory data → false sense of isolation | Wire repos + RLS together |
| S5 | Medium | support-user portal without deep matrix | Explicit grants / deny-by-default |
| S6 | Medium | Storage policy review incomplete | Audit branding buckets |
| S7 | Low | Anon keys in repo | Rotate if ever treated as secret; prefer CI injection |

## JWT Validation

Supabase JS client is configured via environment. Production JWT validation occurs at Supabase API edge. Angular trusts session from SDK — acceptable when all data access goes through RLS-protected APIs. **Current V1 demo does not depend on JWT for business CRUD** because repositories are in-memory.

## Sign-off Recommendation

**Do not enable live multi-tenant production traffic** until S1–S4 are closed.
