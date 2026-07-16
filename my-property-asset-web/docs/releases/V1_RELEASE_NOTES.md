# MyPropertyAsset Web — Release Notes v1.0.0

**Release date:** 2026-07-16  
**Codename:** Production Hardening (P17)

## Highlights

- Complete Builder Portal operational suite (projects through communications + subscription).  
- Complete Super Admin control plane (builders, billing, branding oversight, operations, support, analytics, settings).  
- SQL migrations for foundation, builder org/projects/buildings, branding, communications, subscriptions, platform management.  
- RBAC, org context, plan enforcement, payment provider abstraction.  
- Version stamped **1.0.0**; full unit suite green (**77/77**).

## Included Phases

P1–P16 feature delivery + P17 hardening documentation and release pack.

## Not Included in 1.0.0 Production Mode

- Live Supabase repositories for business CRUD  
- Units + owner-assignment SQL batches  
- RLS on late commercial tables  
- Live payment gateway checkout  
- Automated E2E browser suite  

## Upgrade Notes

From pre-1.0.0 builds: update environment `appVersion`, rebuild, review `docs/releases/V1_RELEASE_CHECKLIST.md` before promoting beyond demo.

## Known Issues

See [`V1_KNOWN_LIMITATIONS.md`](./V1_KNOWN_LIMITATIONS.md) and executive issue register.
