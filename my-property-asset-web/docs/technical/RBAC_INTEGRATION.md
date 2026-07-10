# RBAC Integration — MyPropertyAsset Web Platform

**Companion to:** [`NG-006_Authentication_Authorization_Architecture.md`](NG-006_Authentication_Authorization_Architecture.md)
**Purpose:** How the Angular platform's `shared-rbac` (Core library, NG-001 §9) actually evaluates `PERMISSION_MATRIX.md` at runtime — the mechanism, not a restatement of A-008's rules.

## 14. RBAC Integration

**`shared-rbac` is the only code in this entire workspace that reads `PERMISSION_MATRIX.md`'s rules.** Every route guard, every menu-visibility check, every Feature-load gate asks `shared-rbac` "may I," and never independently re-derives an answer by inspecting the matrix itself. This is a structural guarantee, not a convention: NG-003's Nx tag matrix already ensures no Feature library can bypass Core to reach `PERMISSION_MATRIX.md`'s source data directly, because that data doesn't exist as a runtime artifact any Feature could import — it exists as this document series' own specification, which `shared-rbac`'s implementation (not designed here) is the single translation point for.

## Resolution Inputs and Output

| Input | Source |
|---|---|
| Authentication Context | `shared-auth` |
| Organization Context | `shared-organization-context` |
| User Context (role) | Resolved from Organization membership, per `ROLE_CATALOG.md` |
| Support Access grant (Super Admin only, optional) | A-008 §7 — extends, never replaces, the base permission set |

**Output:** one resolved permission-set Signal, consumed identically by route guards (`AUTHORIZATION_ARCHITECTURE.md` §19), Feature-load gates (§20), and menu visibility (§21) — never three separately-maintained answers to the same question.

## Alignment With `PERMISSION_MATRIX.md`'s Vocabulary

The eight permission levels A-008 defined (Full, Operate, Contribute, Decide, Read, Own-Read, None, Delegated) map onto this resolved Signal directly — `shared-rbac` does not invent a parallel vocabulary (e.g., a simplified boolean "canEdit"/"canView") that would risk drifting from A-008's actual distinctions. A route or menu item checking "does my permission level satisfy at least Contribute for this resource" is asking the same question A-008's matrix already answers, phrased identically.

## The One Rule With No Exception, Restated Once More Because It Belongs Here Too

No resolved permission set — for any role, under any Support Access grant, at any point in this session lifecycle — ever includes access to Restricted-Financial data (A-007 ID-13). `shared-rbac`'s evaluation logic has no code path that can produce that output, by design, the same way NG-003 refused to create a `property` library that could ever hold such data in the first place. Authorization architecture and library architecture agree with each other here, because both were built against the same absolute rule.
