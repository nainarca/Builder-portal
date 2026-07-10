# Resource Matrix — MyPropertyAsset Web Platform

**Companion to:** [`A-008_RBAC.md`](A-008_RBAC.md)
**Purpose:** The catalog of protectable resources RBAC governs. **These are A-007's 15 Information Domains, reused directly, not re-derived** — RBAC governs access *to* information, so inventing a second resource catalog alongside A-007's would be exactly the "duplicate" this document's own pre-check forbids.

| Resource ID | Name (= A-007 Domain) | Classification (from `METADATA_STANDARDS.md`) | Owning Role (from `A-007` §7) |
|---|---|---|---|
| ID-01 | Public Marketing & Lead Information | Public (content) / Internal (leads) | MyPropertyAsset commercial function |
| ID-02 | Builder Onboarding & Approval Information | Internal | Super Admin |
| ID-03 | Organization & Tenancy Information | Organization-Confidential | Super Admin (admin) + Organization (subject) |
| ID-04 | White-label & Branding Information | Organization-Confidential | Super Admin (admin) + Builder Organization (subject) |
| ID-05 | Subscription & Commercial Information | Internal | Super Admin |
| ID-06 | Platform Operations Information | Internal | Super Admin |
| ID-07 | Project & Unit Information | Organization-Confidential | Builder Organization |
| ID-08 | Owner Assignment & Prospect Information | Organization-Confidential | Builder Organization |
| ID-09 | Handover Document Information | Organization-Confidential | Builder Organization → Owner Organization (transfers) |
| ID-10 | Invitation Information | Organization-Confidential | Builder Organization |
| ID-11 | Notification Information | Organization-Confidential | Whichever product/actor generated it |
| ID-12 | Reporting & Analytics Information | Organization-Confidential / Internal | Builder Organization / Super Admin |
| ID-13 | Owner Financial & Property Information | **Restricted-Financial** | Property Owner, always |
| ID-14 | User Identity & Access Information | Sensitive by default (no clean fit on the 4-level scale, per A-007) | Super Admin (identity) + each Organization (membership) |
| ID-15 | Future Tenant Information | Not yet classified | Not yet assigned |

**Resolution of A-007's open question (§8 of that document):** Super Admin's access to ID-07 through ID-10 (Builder-Organization-scoped operational data) is **none by default**. See `A-008_RBAC.md` §7 for the Support Access delegation mechanism that provides the narrow, audited exception this platform needs for support scenarios without breaking Organization isolation as a standing rule.
