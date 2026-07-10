# Session Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-006_Authentication_Authorization_Architecture.md`](NG-006_Authentication_Authorization_Architecture.md)
**Covers:** Security Context Lifecycle, Security Event Flow, Audit Integration, Owner Integration.

## Security Context Lifecycle

Three independently-resolved Signals compose a session's full security context, resolved in this order and never collapsed into one monolithic object (§ Architecture Decisions in the main document, ADR-012):

```
Authentication Context (who)  →  Organization Context (within what)  →  User Context (as whom, role) → Permission Set (may do what)
```

Each layer depends only on the one before it — Authentication Context never depends on Organization Context (identity doesn't require an Organization to exist), but Organization Context always requires a valid Authentication Context first. This ordering is not arbitrary: it is what makes Public Visitor Context (`AUTHORIZATION_ARCHITECTURE.md` §17) a clean "all four layers absent" state rather than a special case requiring its own logic path.

## 23. Security Event Flow

| Event | Flows to |
|---|---|
| Failed authorization attempt (RLS denial, or a route guard rejecting a Permission Set check) | `infra-error-handling`, `infra-logging` (NG-003) — logged loudly, per NG-000 §11's rule that Organization-isolation violations must never fail silently |
| Support Access invocation, extension, or expiry | Same Infrastructure libraries, **plus** the intended destination is the Audit information domain (A-007 ID-06) — still gap-flagged, no backing A-003A story, across five prior documents now. This document does not resolve that gap; it restates that Support Access is exactly the kind of event that domain exists to capture, strengthening (again) the case for finally writing its story |
| Session anomaly (e.g., a token refresh failing unexpectedly) | `infra-error-handling` — surfaced to the user as a re-authentication prompt, never a silent retry loop that could mask a real problem |

## 27. Audit Integration

Restated, not re-solved: every Security Event above is a natural Audit record once ID-06's Audit sub-domain has a real specification. This document treats Audit Integration as "here is exactly what would flow there," not as an opportunity to design that domain itself — that remains explicitly out of scope for this document, consistent with every prior document's treatment of the same gap.

## 18. Owner Integration

**The Owner Mobile App (Flutter) has its own, entirely separate Supabase Auth session, never shared with this Angular platform's sessions.** A person who is both a Builder Organization member (web) and a Property Owner (mobile) holds two fully independent sessions on two different clients — there is no session-sharing mechanism, no single sign-on between them, and none is designed here. The only connection point between the two platforms' authentication worlds is the invitation deep link (NG-004 § Owner App Integration) — a URL handoff, not a token handoff. This is a deliberate, not accidental, boundary: it keeps this document's entire Authorization Architecture (§ Route Protection, Feature Authorization, Menu Authorization) from ever needing to reason about mobile-app state at all.
