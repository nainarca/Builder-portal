# Information Domains — MyPropertyAsset Web Platform

**Companion to:** [`A-007_Information_Architecture.md`](A-007_Information_Architecture.md) (full per-domain specification)
**Purpose:** Flat, scannable master list of every information domain in the platform.

| Domain ID | Name | Products | Business Owner | Security Classification |
|---|---|---|---|---|
| ID-01 | Public Marketing & Lead Information | Public Website | Marketing/Commercial (external to platform) | Public |
| ID-02 | Builder Onboarding & Approval Information | Public Website → Super Admin | Super Admin | Internal |
| ID-03 | Organization & Tenancy Information | Super Admin (shared with all products) | Super Admin | Organization-Confidential |
| ID-04 | White-label & Branding Information | Super Admin → Builder Portal | Super Admin | Organization-Confidential |
| ID-05 | Subscription & Commercial Information | Super Admin | Super Admin | Internal |
| ID-06 | Platform Operations Information | Super Admin | Super Admin | Internal *(Audit sub-domain has no backing A-003A story — see A-007 §16)* |
| ID-07 | Project & Unit Information | Builder Portal | Builder Administrator | Organization-Confidential *(depends on undesigned backend Builder Projects domain)* |
| ID-08 | Owner Assignment & Prospect Information | Builder Portal | Builder Administrator | Organization-Confidential *(NOT a CRM — minimal linking data only)* |
| ID-09 | Handover Document Information | Builder Portal → Owner Mobile App | Transfers from Builder to Owner Organization | Organization-Confidential |
| ID-10 | Invitation Information | Builder Portal → Owner Mobile App | Builder Administrator | Organization-Confidential |
| ID-11 | Notification Information | Cross-product | Each product for its own triggers | Organization-Confidential |
| ID-12 | Reporting & Analytics Information | Builder Portal, Super Admin | Builder Administrator / Super Admin | Organization-Confidential / Internal |
| ID-13 | Owner Financial & Property Information | Owner Mobile App (reference only) | Property Owner | Restricted-Financial |
| ID-14 | User Identity & Access Information | Cross-product | Super Admin (platform-wide identity), each Organization (membership) | Restricted-Financial-adjacent (identity is always sensitive) |
| ID-15 | Future Tenant Information | Future Tenant Mobile App | Not yet assigned | Not yet classified |

**Total: 15 information domains** (13 fully specified, 1 partially gap-flagged at the sub-domain level, 1 future-only).
