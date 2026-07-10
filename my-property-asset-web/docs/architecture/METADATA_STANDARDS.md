# Metadata Standards — MyPropertyAsset Web Platform

**Companion to:** [`A-007_Information_Architecture.md`](A-007_Information_Architecture.md)
**Purpose:** The metadata fields every information domain carries, standardized once here rather than redefined per domain. Business-level field *names and meaning* only — no data types, no SQL, no schema.

## Universal Metadata (every domain, no exceptions)

| Field | Meaning |
|---|---|
| Created timestamp | When the record came into existence |
| Last updated timestamp | When the record last changed |
| Organization scope | Which Organization (if any) the record belongs to — the primary isolation boundary across this entire platform |
| Security classification | One of: Public, Internal, Organization-Confidential, Restricted-Financial (see below) |

## Classification Levels (referenced by every domain in `INFORMATION_DOMAINS.md`)

| Level | Meaning | Who can ever see it |
|---|---|---|
| **Public** | No restriction | Anyone, including unauthenticated visitors |
| **Internal** | Platform-operations data | Super Admin only |
| **Organization-Confidential** | Scoped to one Organization | Members of that Organization only (Builder or Owner, per type) |
| **Restricted-Financial** | The platform's most sensitive category | The owning Property Owner only — explicitly never Super Admin's routine view, never a Builder, matching the backend's existing "managers never see financial data" rule |

## Domain-Specific Metadata Additions

| Domain | Additional Metadata |
|---|---|
| ID-02 Builder Onboarding | Approval status, approved/rejected by, decision reason |
| ID-07 Project & Unit | Lifecycle state (A-002 §12's state set) |
| ID-08 Owner Assignment | Assignment status (assigned / needs reassignment) |
| ID-09 Handover Document | Ownership state (Builder-owned-pending / Owner-owned-transferred), transfer timestamp |
| ID-10 Invitation | Token expiry, status (pending/accepted/declined/expired) |
| ID-11 Notification | Read/unread state, delivery channel |
| ID-14 User Identity | Role (per-Organization), Organization type (Builder/Owner) |

## Lifecycle Vocabulary (referenced by every domain's Lifecycle field in A-007)

A three-stage vocabulary used consistently across all domains: **Draft/Pending** (not yet active or visible to its eventual audience) → **Active** (in normal use) → **Archived/Historical** (retained for record but no longer part of active workflows). Individual domains map their own specific states onto this vocabulary rather than inventing a parallel one (e.g., ID-07's "Draft → ... → Handed Over" maps Handed Over to Archived/Historical from the Builder's perspective, while remaining Active from the Owner's).

## Retention Considerations (business-level only — no specific retention periods are set by this document)

- **Immutable/never-deleted domains** (matching the backend's existing immutable-ledger convention for financial records): Invitation history, handover completion records, audit records (once ID-06's Audit sub-domain is properly specified).
- **Deletable-on-request domains**: Lead records (ID-01) not yet converted, per standard data-subject-request expectations — not a designed mechanism here, just a named consideration for a future privacy/compliance document.
- **Organization-lifecycle-bound domains**: Project/Unit/Document data (ID-07/ID-09) persists for as long as its owning Organization exists; what happens on Organization deletion (does a handed-over property's documents survive the Builder Organization's later deletion?) is an open question, not resolved here — flagged as a future consideration.
