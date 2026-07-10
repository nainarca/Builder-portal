# Module Permissions — MyPropertyAsset Web Platform

**Companion to:** [`A-008_RBAC.md`](A-008_RBAC.md)
**Purpose:** Role access per working module. Uses A-007 §2.1's explicitly-provisional **Working Module Reference** (no real A-006 exists) — this table inherits that caveat and should be reconciled if/when a real A-006 is written.

| Working Module | Super Admin | Builder Org Owner | Builder Org Admin | Builder Org Member | Owner Org Owner |
|---|---|---|---|---|---|
| Marketing & Conversion | Read + administer leads | Read (as any visitor) | Read | Read | Read |
| Builder Onboarding | Decide (approve/reject) | Own submission only | None | None | None |
| Tenancy & Branding | Full (administrative) | Read, own Org | Read, own Org | None | Read, own Org |
| Commercial | Full | Read, own Org | Read, own Org | None | N/A |
| Operations | Full | None | None | None | None |
| Project & Unit Preparation | Delegated (Support Access) | Full, own Org | Full, own Org | Contribute, own Org | None |
| Handover | Delegated | Full, own Org | Full, own Org | Contribute, own Org | Decide (accept/decline own invitation) |
| Reporting | Full, platform-wide | Read, own Org | Read, own Org | Read, own Org | None |
| Communication (Notifications) | Own | Own | Own | Own | Own |
| Owner Property Management (reference) | **None, no exception** | **None, no exception** | **None, no exception** | **None, no exception** | Full, own properties |

Every module's access level here is derived directly from `PERMISSION_MATRIX.md`'s per-resource rows — this table is a module-level rollup for convenience, not an independent authorization source. Where a module spans multiple resources with different levels (e.g., Handover spans ID-09/ID-10 with different Builder-role nuances), the level shown here is the module's dominant/representative level — always defer to `PERMISSION_MATRIX.md` for resource-level precision.
