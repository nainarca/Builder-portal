# Permission Matrix — MyPropertyAsset Web Platform

**Companion to:** [`A-008_RBAC.md`](A-008_RBAC.md)
**Purpose:** Role × Resource access levels. Permission levels (defined once, applied throughout):

| Level | Meaning |
|---|---|
| **Full** | View, Create, Edit, Archive/Delete, and Configure |
| **Operate** | View, Create, Edit — no Archive/Delete, no Configure |
| **Contribute** | View, Create, Edit own contributions — no Archive/Delete, no Configure, no team/invite actions |
| **Decide** | View + Approve/Reject only (no Create/Edit of the underlying record) |
| **Read** | View only |
| **Own-Read** | View, limited to records the individual actor themself owns/is the subject of |
| **None** | No access of any kind |
| **Delegated** | No standing access; accessible only via the explicit Support Access mechanism (A-008 §7), time-boxed and audited |

## Matrix

| Resource | Super Admin | Builder Org Owner | Builder Org Admin | Builder Org Member | Owner Org Owner | Public Visitor |
|---|---|---|---|---|---|---|
| ID-01 Marketing & Leads (content) | Read | Read | Read | Read | Read | Read |
| ID-01 Marketing & Leads (lead records) | Full | None | None | None | None | Create (submit only) |
| ID-02 Builder Onboarding | Decide (approve/reject) + Read | Own submission: Read only | None | None | None | Create (submit only) |
| ID-03 Organization & Tenancy | Full (administrative) | Full, own Organization only | Operate, own Organization only | Read, own Organization only | Full, own Organization only | None |
| ID-04 White-label & Branding | Full, any Organization | Read, own Organization only *(configuration itself is Super-Admin-only per A-004 §6 SA-06)* | Read, own Organization only | None | N/A (Owner-type Organizations don't use this resource) | None |
| ID-05 Subscription & Commercial | Full | Read, own Organization only | Read, own Organization only | None | N/A | None |
| ID-06 Platform Operations (Monitoring) | Full | None | None | None | None | None |
| ID-06 Platform Operations (Audit) | Full *(scope itself still gap-flagged — A-007 §16)* | None | None | None | None | None |
| ID-07 Project & Unit | Delegated (Support Access only) | Full, own Organization only | Full, own Organization only | Contribute, own Organization only | None | None |
| ID-08 Owner Assignment & Prospect | Delegated | Full, own Organization only | Full, own Organization only | Contribute, own Organization only | None | None |
| ID-09 Handover Document (pre-handover) | Delegated | Full, own Organization only | Full, own Organization only | Contribute, own Organization only | None (not yet transferred) | None |
| ID-09 Handover Document (post-handover) | Delegated | Read, own Organization only (historical) | Read, own Organization only (historical) | Read, own Organization only (historical) | Full, own property only | None |
| ID-10 Invitation | Delegated | Full, own Organization only | Full, own Organization only | Contribute (send/track, no cancel), own Organization only | Decide (accept/decline), own invitation only | None |
| ID-11 Notification | Own, Read + dismiss | Own, Read + dismiss | Own, Read + dismiss | Own, Read + dismiss | Own, Read + dismiss | None |
| ID-12 Reporting & Analytics | Full, platform-wide | Read, own Organization only | Read, own Organization only | Read, own Organization only | None (no Builder-side report concept for Owners) | None |
| ID-13 Owner Financial & Property | **None — not even Delegated; no exception mechanism reaches this resource** | **None** | **None** | **None** | Full, own property only | None |
| ID-14 User Identity & Access | Full (platform identity administration) | Operate, own Organization membership only | Operate, own Organization membership only | Own-Read | Own-Read | None |
| ID-15 Future Tenant | Not designed | Not designed | Not designed | Not designed | Not designed | Not designed |

**The one absolute rule in this matrix, stated plainly because it's the most important row:** ID-13 (Owner Financial & Property Information — Loan, Expense, Tenant, Financial History) has **no path of access for any role except the owning Property Owner** — not Super Admin, not any Builder role, not even via the Support Access delegation mechanism that applies to every other Organization-Confidential resource. This is a deliberate, hard-coded exception to the delegation model, matching the backend's existing "managers never see financial data" rule at maximum strength.
