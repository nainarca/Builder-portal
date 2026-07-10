# Role Catalog — MyPropertyAsset Web Platform

**Companion to:** [`A-008_RBAC.md`](A-008_RBAC.md)
**Purpose:** Every role recognized by the platform's RBAC model, its scope, and its position in the hierarchy.

## System Roles (platform-wide, not Organization-scoped)

| Role | Scope | Description |
|---|---|---|
| **Public Visitor** | None (unauthenticated) | Baseline zero-permission actor — included for completeness, not a "role" in the access-control sense |
| **Super Admin** | Platform-wide | Full administrative authority over Internal-classification resources; **no standing access** to any Organization-Confidential or Restricted-Financial resource; may invoke time-boxed **Support Access** (A-008 §7) into a specific Organization's Organization-Confidential data only, never Restricted-Financial |

## Organization Roles (reused from the backend's `PLATFORM_FOUNDATION_SPECIFICATION.md` — owner/admin/member, not reinvented here)

These three roles exist once, at the Organization level, and apply identically whether the Organization is Builder-type or Owner-type — consistent with A-002 §16's resolution that Organization is one shared construct. What differs between Builder-type and Owner-type is *which resources exist to have permissions over*, not the role names themselves.

| Role | Applies to | Description |
|---|---|---|
| **Organization Owner** | Any Organization | Full authority within their own Organization, including irreversible actions (delete Organization, transfer ownership, remove any member including other owners) |
| **Organization Admin** | Any Organization | Full operational authority within their own Organization, except irreversible/ownership-transfer actions |
| **Organization Member** | Any Organization | Scoped operational access within their own Organization — exact scope resolved per Organization type below |

### Builder Roles (Organization roles, instantiated in a Builder-type Organization)

| Role | Resolves |
|---|---|
| **Builder Organization Owner** | = Organization Owner, Builder-type. The "Builder Administrator" referred to throughout A-002–A-007 is, precisely, this role or Builder Organization Admin — those documents did not distinguish Owner from Admin because the distinction wasn't needed until now |
| **Builder Organization Admin** | = Organization Admin, Builder-type |
| **Builder Organization Member** | = Organization Member, Builder-type. **Newly scoped by this document** (A-005 §3 flagged this as undefined): can create/edit Projects, Units, and Documents; **cannot** invite owners, manage team members, or edit Organization Settings/White-label/Subscription — a working-level contributor, not an administrator |

### Owner Roles (Organization roles, instantiated in an Owner-type Organization)

| Role | Resolves |
|---|---|
| **Owner Organization Owner** | = Organization Owner, Owner-type. The property owner themselves. Today, every Owner-type Organization has exactly one member (per `PLATFORM_FOUNDATION_SPECIFICATION.md`'s personal-Organization model), so this role is currently the *only* Owner-type role actually exercised |
| **Owner Organization Admin / Member** | = Organization Admin/Member, Owner-type. Defined here for completeness and future consistency with the shared Organization model, but **not exercised by any current screen or flow** — reserved for a future multi-member Owner Organization (e.g., family or co-investment sharing), which is not designed anywhere in this series |

## Future Tenant Roles (high-level only, per instruction)

| Role | Description |
|---|---|
| **Tenant** | Exists today as an in-app role (`property_access`, per the backend architecture) with its own scoped access to lease/payment/maintenance data. Not redesigned here. A future Tenant Mobile App would extend this same role to a new client surface, not create a new one (A-003 §9, A-003A §3.5, A-005 §19, A-007 ID-15) |

## Role Hierarchy

```
Super Admin (system, platform-wide)
   │  (no standing inheritance into any Organization — isolated by design)
   │  (Support Access: explicit, time-boxed, audited exception — A-008 §7)

Organization Owner
   └─ inherits everything Organization Admin can do, plus irreversible actions
Organization Admin
   └─ inherits everything Organization Member can do, plus team/settings/invite authority
Organization Member
   └─ baseline operational access within the Organization
```

This hierarchy applies once, identically, within every Organization — there is no cross-Organization hierarchy (a Builder Organization Owner has zero standing authority over any other Organization, including other Builder-type ones).
