---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-008 |
| **Document Name** | Permission Matrix (RBAC) |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Security Architect / Enterprise Solution Architect / SaaS Product Architect / IAM Architect / Business Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001, A-002, A-003, A-003A, A-004, A-005, ~~A-006~~ *(does not exist)*, A-007 |
| **Referenced Documents** | All prior A-series documents; `PLATFORM_FOUNDATION_SPECIFICATION.md` (backend Organization/role model, reused not reinvented) |
| **Previous Document** | A-007 Information Architecture |
| **Next Document** | A-009 Business Architecture Review & Gap Analysis |
| **Related ADR** | None yet — see `docs/adr/ADR_INDEX.md` |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`ROLE_CATALOG.md`](ROLE_CATALOG.md), [`RESOURCE_MATRIX.md`](RESOURCE_MATRIX.md), [`PERMISSION_MATRIX.md`](PERMISSION_MATRIX.md), [`MODULE_PERMISSIONS.md`](MODULE_PERMISSIONS.md), [`SCREEN_PERMISSIONS.md`](SCREEN_PERMISSIONS.md), [`diagrams/A-008_RBAC_Diagrams.md`](diagrams/A-008_RBAC_Diagrams.md).

---

# A-008 — Permission Matrix (RBAC)

## Pre-Check Result

A-001 through A-005 and A-007 were read in full and are treated as source of truth; nothing in any of them is modified or contradicted below. **A-006 still does not exist** — this document inherits A-007 §2.1's provisional Working Module Reference rather than re-deriving a third version of it, and does not treat its own absence as a new blocking issue requiring another round of user confirmation, consistent with the resolution already reached for A-007. No ADR documents exist. Role, screen, module, and resource consistency were verified directly against `ROLE_CATALOG.md`'s reuse of the backend's existing owner/admin/member model, A-004's 33-screen inventory, A-007 §2.1's module reference, and A-007's 15 information domains respectively — no duplicate role, screen, module, or permission was introduced (`SCREEN_INVENTORY.md`, `INFORMATION_DOMAINS.md` cross-checked).

**This document resolves two open questions carried forward from prior documents, rather than flagging them a further time:**
1. **Super Admin's visibility into Builder-Organization-scoped data** (open since A-007 §8) — resolved in §7 via the Support Access delegation mechanism: no standing access, an explicit time-boxed audited exception for support cases.
2. **Builder Organization Member's exact permission scope** (open since A-005 §3) — resolved in `ROLE_CATALOG.md` and `SCREEN_PERMISSIONS.md`: operational contribution without invite, delete, or settings authority.

**One dependency is escalated, not resolved, here:** the backend Builder Projects domain remains undesigned. This is now the seventh consecutive document (A-002 → A-003 → A-003A → A-004 → A-005 → A-007 → A-008) to depend on it — see §12.

---

## 1. Executive Summary

This document defines the platform's complete Role-Based Access Control model: who can do what, to which resources, within which Organization boundary. It reuses, rather than reinvents, two things prior documents already established — the backend's existing owner/admin/member Organization role model, and A-007's 15 information domains as the resource catalog — and adds what neither of those provided: an actual permission matrix, a resolved answer to Super Admin's support-access question, and a newly-scoped Builder Organization Member role. No Angular guards, SQL, RLS policies, or API content appears anywhere in this document.

## 2. Security Principles

- **Organization isolation is absolute for Organization-Confidential and Restricted-Financial resources** — no role, including Super Admin, has standing cross-Organization access. This is a restatement, not a new rule, of what A-003A §6, A-004 §12, and A-005 §6/§8 already established; this document is the first to make it a formal RBAC rule rather than a screen-by-screen convention.
- **Restricted-Financial has no delegation path.** Every other Organization-Confidential resource can be reached via Support Access (§7) under narrow conditions; ID-13 (Owner Financial & Property Information) cannot, ever, by any role.
- **Roles are reused, not multiplied.** The same three Organization roles (Owner/Admin/Member) apply to both Builder-type and Owner-type Organizations — this document does not invent a parallel role set for each product.
- **Permissions are additive down a hierarchy, never lateral.** An Organization Owner has everything an Admin has; nothing grants a permission sideways between peer roles.
- **Least privilege by default; delegation is explicit, time-boxed, and audited** — never a standing broadened role.

## 3. Role Catalog

See [`ROLE_CATALOG.md`](ROLE_CATALOG.md) in full. Summary: 2 System Roles (Public Visitor, Super Admin) + 3 Organization Roles (Owner/Admin/Member) instantiated across 2 Organization types (Builder, Owner) = 6 concrete roles in active use today, plus Tenant (existing, referenced only) and a reserved-but-unused Owner Organization Admin/Member pair for future multi-member Owner Organizations.

## 4. Resource Catalog

See [`RESOURCE_MATRIX.md`](RESOURCE_MATRIX.md) — A-007's 15 Information Domains, unchanged, with classification and owning-role columns added for this document's purposes.

## 5. Permission Matrix

See [`PERMISSION_MATRIX.md`](PERMISSION_MATRIX.md) in full — the core Role × Resource matrix, using a defined 8-level permission vocabulary (Full/Operate/Contribute/Decide/Read/Own-Read/None/Delegated).

## 6. Role Hierarchy

```
Super Admin (isolated — no inheritance into any Organization)

Per-Organization:
Organization Owner ⊃ Organization Admin ⊃ Organization Member
```
Full diagram: `diagrams/A-008_RBAC_Diagrams.md` §1. This hierarchy is instantiated once per Organization — a Builder Organization Owner's authority never extends beyond their own Organization, and there is no platform-wide "super owner" role beneath Super Admin that spans multiple Organizations.

## 7. Ownership Rules

Reused directly from A-007 §7 (Information Ownership) — this document does not redefine who owns what, only who may *access* what they don't own.

**Support Access (the resolution to A-007 §8's open question):** Super Admin may be granted time-boxed, audited access to a specific Builder Organization's Organization-Confidential resources (ID-07 through ID-10) for an active support case. This is:
- **Explicit** — not a standing permission; must be invoked per case (the invocation mechanism itself — approval workflow, duration limits — is an authorization-strategy implementation detail, not designed further here, per this document's own constraints).
- **Time-boxed** — expires automatically; does not persist as a permanent elevated role.
- **Audited** — every invocation is itself an ID-06 Audit record (closing the loop with A-007 ID-06's own gap-flagged Audit sub-domain — this document's Support Access mechanism is precisely the kind of event that domain needs to capture, strengthening the case for finally writing its backing A-003A story).
- **Never applicable to ID-13** — Restricted-Financial data has no Support Access path, full stop (§2, `PERMISSION_MATRIX.md`).

**Delegation vs. inheritance, stated once for clarity:** inheritance (§6) is structural and permanent (an Owner always has an Admin's permissions). Delegation (Support Access) is the opposite — temporary, exceptional, and revocable — and the only delegation mechanism this document defines.

## 8. Organization Isolation

| Rule | Applies to |
|---|---|
| No role sees another Organization's Organization-Confidential data by default | All roles, all Organization-Confidential resources |
| No role — including Super Admin, including via Support Access — ever sees another user's Restricted-Financial data | All roles, ID-13 |
| A Builder Organization's Members never see another Builder Organization's data, even of the same "type" | Builder Org Owner/Admin/Member |
| An Owner Organization's data is never visible to any Builder Organization, before or after handover, except the specific transferred Document/Property record at the moment of transfer (ID-09/ID-10) | All Builder roles |

Full diagram: `diagrams/A-008_RBAC_Diagrams.md` §3.

## 9. Feature Permissions

Feature-level access (as distinct from resource-level, §5) follows directly from `MODULE_PERMISSIONS.md` — no feature is gated by a rule not already expressed as a module or resource permission. This document does not introduce a third, independent feature-flag concept (that would risk exactly the "duplicate permissions" the pre-check forbids) — Feature Management (A-004 SA screens) is itself an ID-06-adjacent Super-Admin-only capability, already covered.

## 10. Screen Permissions

See [`SCREEN_PERMISSIONS.md`](SCREEN_PERMISSIONS.md) in full — every one of A-004's 33 screens, mapped to the roles that may access it, using A-004's own Screen IDs unchanged.

## 11. Module Permissions

See [`MODULE_PERMISSIONS.md`](MODULE_PERMISSIONS.md) in full — a module-level rollup of `PERMISSION_MATRIX.md`, using A-007 §2.1's provisional Working Module Reference.

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Builder Projects backend domain is now a 7-consecutive-document dependency**, and this document's entire Builder-role permission structure (ID-07/ID-08 rows) is built on that undesigned foundation | Permissions for Projects/Units cannot be enforced by anything until the domain exists | Escalating language used here (§ Pre-Check Result) rather than a routine flag; recommend this block A-009's own review from declaring the platform "ready" in any sense until resolved |
| Support Access (§7) is defined at the policy level but its invocation mechanism (who approves it, how long it lasts, how it's requested) is deliberately not designed here | A future authorization-strategy document (NG-005) must pick this up, or the mechanism risks being implemented ad hoc, inconsistently with the policy stated here | Named explicitly as out of this document's scope, not silently omitted |
| Builder Organization Member's newly-defined scope (§ Pre-Check Result) has no backing A-003A story either — it's a permission-level decision made directly in this document, without a user story ever describing a Member's day-to-day experience | If a Member's actual workflow differs from what's assumed here, this permission scoping may need revision | Flagged; recommend a Member-specific user story be added to A-003A retroactively if this role becomes more than theoretical |
| A-006 remains unwritten, now inherited by a third consecutive document (A-007, A-008) via the provisional Working Module Reference | Module-level permissions in `MODULE_PERMISSIONS.md` are only as reliable as that provisional reference | Restated; same standing recommendation as A-007 §14 |

## 13. Assumptions

- The backend's existing owner/admin/member Organization role model (`PLATFORM_FOUNDATION_SPECIFICATION.md`) is stable and correctly reused here without modification.
- Support Access's exact workflow (approval, duration) can be designed later without invalidating the policy-level rules set here (no standing access, always audited, never reaching ID-13).
- A-007's classification scheme (Public/Internal/Organization-Confidential/Restricted-Financial) is sufficient to drive every permission decision in this document — no fifth classification level was needed.

## 14. Constraints

- No Angular route guards, APIs, SQL, Supabase RLS policies, authentication flows, or UI components appear anywhere in this document (explicit Quality Rule).
- The Builder Portal exclusion list (CRM/Sales/HR/Payroll/Accounting/Inventory/Procurement/Society Management) constrains every Builder-role permission in this document exactly as it constrained every prior one — no permission here grants access to a capability that shouldn't exist in the first place.
- No permission was assigned to a screen or resource that doesn't exist (the two A-005 navigation gaps — Owners, Profile — are explicitly marked "no permission assignable" in `SCREEN_PERMISSIONS.md`, not silently given one).

## 15. Future Expansion

- Support Access's invocation mechanism (a future NG-005 Authorization Strategy concern).
- Owner Organization Admin/Member roles, once a multi-member Owner Organization scenario is actually designed.
- Future Tenant Role's actual permission set, once the Tenant Mobile App is scoped.
- Reconciliation of `MODULE_PERMISSIONS.md` against a real A-006, if one is ever written.
- A proper Audit information domain (A-007 ID-06) backing story — now more clearly motivated by Support Access's own audit requirement (§7).

## 16. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-008 entry. No prior document was overwritten.

## 17. Updated ADR List

**Not required for a new ADR entry**, but worth noting: the Support Access delegation pattern (§7) is exactly the kind of decision an ADR is meant to capture once a real authorization-strategy document (NG-005) formalizes it. Flagged in `docs/adr/ADR_INDEX.md`'s open-items list as a candidate, not drafted as a full ADR here (this document's own scope is RBAC policy, not ADR governance).

## 18. Review Checklist

- [ ] Role catalog (`ROLE_CATALOG.md`) confirmed as a correct, non-duplicative reuse of the backend's existing Organization role model
- [ ] Support Access mechanism (§7) accepted as the resolution to Super Admin's Builder-data visibility question, or redirected
- [ ] Builder Organization Member's newly-scoped permissions (`SCREEN_PERMISSIONS.md`) reviewed against real operational needs, ideally backed by a future A-003A story
- [ ] The ID-13 "no exception, ever" rule (§2, `PERMISSION_MATRIX.md`) confirmed as an intentional, permanent design choice, not a placeholder
- [ ] Builder Projects backend dependency (§12) escalated appropriately for A-009's review

## 19. Approval Checklist

- [ ] Reviewed by Enterprise Security Architect / IAM Architect
- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-009 (Business Architecture Review & Gap Analysis) authorized to begin
