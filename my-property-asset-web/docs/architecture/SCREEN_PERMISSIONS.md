# Screen Permissions — MyPropertyAsset Web Platform

**Companion to:** [`A-008_RBAC.md`](A-008_RBAC.md)
**Purpose:** Role access per screen, using A-004's exact 33-screen inventory (`SCREEN_INVENTORY.md`) — no screen is renamed, added, or reinterpreted here beyond assigning who may access it.

## Public Website (all screens: every role including Public Visitor)

| Screen ID | Name | Access |
|---|---|---|
| PW-01–PW-09 | All Public Website screens | Public Visitor (and, incidentally, any authenticated role — nothing restricts an authenticated user from also browsing the public site) |

## Super Admin Portal (Super Admin only, per product-level default; Builder/Owner/Visitor roles: None on every screen in this section)

| Screen ID | Name | Super Admin Access |
|---|---|---|
| SA-01 | Login | Authenticate |
| SA-02 | Dashboard | Full |
| SA-03 | Builder Management (List) | Full |
| SA-04 | Builder Detail & Approval | Full, including Decide (approve/reject) |
| SA-05 | Organization Management | Full |
| SA-06 | White-label Configuration | Full |
| SA-07 | Subscription Management | Full |
| SA-08 | User Management | Full *(screen itself still has no backing A-003A story — A-004 §14; permission assignment doesn't require that detail, but the screen's actual actions remain underspecified)* |
| SA-09 | Platform Monitoring | Full |
| SA-10 | Audit Log | Full *(same story caveat as SA-08)* |
| SA-11 | Settings | Full |

## Builder Handover Portal (Public Visitor: None on every screen in this section)

| Screen ID | Name | Builder Org Owner | Builder Org Admin | Builder Org Member |
|---|---|---|---|---|
| BA-01 | Login | Authenticate | Authenticate | Authenticate |
| BA-02 | Dashboard | Full | Full | Full |
| BA-03 | Projects (List) | Full | Full | Contribute (create/edit, no delete) |
| BA-04 | Project Detail | Full | Full | Contribute |
| BA-05 | Units (List) | Full | Full | Contribute |
| BA-06 | Unit Detail | Full | Full | Contribute |
| BA-07 | Owner Assignment | Full | Full | Contribute (assign, not reassign after decline — reassignment requires Admin+, a new scoping decision made here to prevent a Member from unilaterally overriding a stalled handover) |
| BA-08 | Document Upload | Full | Full | Contribute |
| BA-09 | Invitations (Tracking) | Full (send/resend/view) | Full | Read + resend only, **cannot** send a first invitation (Invite authority is Admin+, per `ROLE_CATALOG.md`'s Member scoping) |
| BA-10 | Documents (Library) | Full | Full | Read + upload (Contribute) |
| BA-11 | Reports | Full | Full | Read |
| BA-12 | Notifications | Full (own) | Full (own) | Full (own) |
| BA-13 | Settings | Full *(screen itself still has no backing A-003A story — A-004 §14)* | Full | **None** — Settings/team management is Owner+Admin only, consistent with `ROLE_CATALOG.md`'s Member exclusion |

**Navigation gaps carried forward (A-005 NAV-BA-04 "Owners," NAV-BA-10 "Profile"):** no screen exists for either, so no permission can be assigned. If/when they're built, the working assumption (not a commitment) is: an "Owners Directory" would follow the same Owner Assignment (BA-07) pattern (Owner/Admin full, Member contribute); a personal "Profile" screen would be Own-Read/Own-Write for every role, since it's individual-account-scoped, not Organization-scoped.

## Owner Mobile App (reference only — existing, unmodified permissions)

| Reference ID | Screen | Access |
|---|---|---|
| OA-REF-01 through OA-REF-05 | All existing Owner Mobile App screens | Owner Org Owner: Full, own account/properties only. **Every other role: None, no exception** (matches `PERMISSION_MATRIX.md`'s ID-13 absolute rule) |
