# Content Hierarchy — MyPropertyAsset Web Platform

**Companion to:** [`A-007_Information_Architecture.md`](A-007_Information_Architecture.md)
**Purpose:** The parent/child structure of content *within* each information domain — distinct from `NAVIGATION_HIERARCHY.md` (which is about screens) and `INFORMATION_DOMAINS.md` (which is a flat catalog). This is "what contains what," not "what links to what" or "who owns what."

## ID-01 — Public Marketing & Lead Information

```
Public Content
├── Marketing Content (Home, Features, Pricing, About, FAQ)
└── Lead Records
    ├── Demo Requests
    ├── Sales Inquiries
    └── Builder Registrations (→ becomes ID-02 once submitted)
```

## ID-02 — Builder Onboarding & Approval Information

```
Builder Registration
├── Company/Contact Information
├── Approval Decision (approve/reject + reason)
└── (on approval) → produces exactly one Organization (ID-03)
```

## ID-03 — Organization & Tenancy Information

```
Organization
├── Identity (name, type: Builder | Owner)
├── Membership (owning user(s))
├── White-label Configuration (ID-04, Builder-type only)
├── Subscription State (ID-05, Builder-type only)
└── (Builder-type only) Projects (ID-07)
```

## ID-04 — White-label & Branding Information

```
Branding Configuration (per Organization, Builder-type only)
└── (mechanism undefined — vision-level only, per A-001 §13/A-002 §16)
```

## ID-05 — Subscription & Commercial Information

```
Subscription (per Organization, Builder-type only)
├── Plan
└── Status (active/inactive)
```

## ID-06 — Platform Operations Information

```
Platform Operations
├── Monitoring Indicators (pending registrations, active Organizations, support backlog)
└── Audit Log (no backing A-003A story — see A-007 §16)
    └── Action Records (actor, action, target, timestamp)
```

## ID-07 — Project & Unit Information

```
Project (belongs to exactly one Builder-type Organization)
└── Unit (belongs to exactly one Project)
    ├── Lifecycle State (Draft → ... → Handed Over, per A-002 §12)
    ├── Owner Assignment (ID-08)
    ├── Documents (ID-09)
    └── Invitation (ID-10)
```
*Depends on the still-undesigned backend Builder Projects domain — this hierarchy describes the business-level shape, not a verified data model (A-007 §16).*

## ID-08 — Owner Assignment & Prospect Information

```
Assignment (per Unit, at most one active at a time)
└── Prospect Contact Detail (name, email/phone — a data link, not a CRM record; no sales-pipeline content, per Builder Portal exclusions)
```

## ID-09 — Handover Document Information

```
Document (uploaded against exactly one Unit)
├── Pre-handover state: Builder-owned, Owner-pending (invisible to any owner)
└── Post-handover state: Owner-owned (same record, transferred — never duplicated)
    └── (Builder retains a read-only historical reference for Reports, ID-12)
```

## ID-10 — Invitation Information

```
Invitation (per Unit, at most one active at a time)
├── Token + Expiry
├── Status (pending/accepted/declined/expired)
└── (on acceptance) → triggers Document (ID-09) and Property (ID-13) transfer
```

## ID-11 — Notification Information

```
Notification (per recipient)
├── Trigger (registration submitted, approval decision, invitation, handover complete, existing owner-app triggers)
├── Recipient (Super Admin, Builder, Owner)
└── Delivery Channel (email/SMS/push — mechanism not designed here)
```

## ID-12 — Reporting & Analytics Information

```
Report
├── Builder-scoped (handover progress across own Organization's projects/units)
└── Super-Admin-scoped (platform-wide monitoring indicators, ID-06)
```
Reports are always *derived* from ID-07/ID-09/ID-10 — never a separate stored copy (consistent with the "reference, don't duplicate" principle carried from the Expense/Loan/Financial Ledger backend work).

## ID-13 — Owner Financial & Property Information (reference only)

```
Property (existing, unmodified backend domain)
├── Loan (existing IES-specified domain)
├── Expense (existing IES-specified domain)
├── Tenant (existing domain)
└── Financial History / Ledger (existing IES-specified domain)
```
Not redesigned here — hierarchy shown only to confirm this document does not introduce a competing structure for already-specified backend content.

## ID-14 — User Identity & Access Information

```
User Identity (Supabase Auth, existing)
├── Platform-wide identity (email, auth credentials)
└── Per-Organization Membership (role: owner/admin/member — per Organization type)
```

## ID-15 — Future Tenant Information

Not designed — future integration point only (A-003 §9, A-003A §3.5, A-005 §19).
