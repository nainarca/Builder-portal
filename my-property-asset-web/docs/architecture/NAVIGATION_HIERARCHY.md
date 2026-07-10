# Navigation Hierarchy — MyPropertyAsset Web Platform

**Companion to:** [`A-005_Navigation_Flow.md`](A-005_Navigation_Flow.md)
**Purpose:** The structural parent/child navigation tree for each product, as a standalone quick-reference.

## Public Website

```
Home (PW-01)
├── Features (PW-02)
│   └── Pricing (PW-03)
├── About (PW-04)
│   └── FAQ (PW-05)
│       └── Contact / Contact Sales (PW-06)  [escalation]
├── Demo Request (PW-07)
├── Builder Registration (PW-08)
└── Login Gateway (PW-09)
    ├── → Super Admin Portal (SA-01)
    └── → Builder Handover Portal (BA-01)
```

## Super Admin Portal

```
Dashboard (SA-02)  [Global Navigation root]
├── Builder Management (SA-03)
│   └── Builder Detail & Approval (SA-04)
│       ├── White-label Configuration (SA-06)
│       └── Subscription Management (SA-07)
├── Organization Management (SA-05)
├── User Management (SA-08)  [no backing story — A-004 §14]
├── Platform Monitoring (SA-09)
├── Audit Log (SA-10)  [no backing story — A-004 §14]
└── Settings (SA-11)
```

## Builder Handover Portal

```
Dashboard (BA-02)  [Global Navigation root]
├── Projects (BA-03)
│   └── Project Detail (BA-04)
│       └── Units (BA-05)
│           └── Unit Detail (BA-06)  [Context Navigation hub]
│               ├── Owner Assignment (BA-07)
│               └── Document Upload (BA-08)
├── Owners  [NAVIGATION GAP — no backing screen, see A-005 §16]
├── Invitations (BA-09)
├── Documents Library (BA-10)
├── Reports (BA-11)
├── Notifications (BA-12)
├── Settings (BA-13)  [no backing story — A-004 §14]
└── Profile  [NAVIGATION GAP — no backing screen, see A-005 §16]
```

## Owner Mobile App (reference only — not redesigned)

```
(existing, unmodified hierarchy)
├── Account Activation (OA-REF-01)  — new entry: invitation link
├── Property Acceptance (OA-REF-02) — new screen, mobile-side, out of this series' scope
├── Property Documents (OA-REF-03)  — unchanged
├── Loan / Expense / Tenant / Financial History (OA-REF-04) — unchanged
└── Notifications (OA-REF-05) — unchanged, two new trigger types feed it
```
