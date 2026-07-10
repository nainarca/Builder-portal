# Authentication Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-006_Authentication_Authorization_Architecture.md`](NG-006_Authentication_Authorization_Architecture.md)
**Resolves:** ADR-002 (Supabase Authentication) — Accepted by this document, open since this series' first prompt.
**Covers:** Authentication Principles, Identity Lifecycle, Login Flow, Logout Flow, Session Lifecycle, Session Refresh Strategy, Token Lifecycle, Authentication Context, Account Recovery, Future SSO, Future MFA.

## 1. Authentication Principles

- **Supabase Auth is the exclusive authentication mechanism for this platform — no parallel system, now formally accepted as ADR-002.** This closes an ADR slot named as an example in this series' very first prompt (A-001) and never picked up by any of the five prior NG documents; NG-006 is where it actually belongs.
- The client never trusts itself for identity. Every authenticated action is re-verified server-side via RLS (NG-000 §14, restated for auth specifically) — a valid-looking session in the Angular app is a UX convenience, not proof of anything to the backend.
- **Public Website has no authentication state at all.** Not "empty," not "anonymous session" — genuinely absent, consistent with A-001 §8's framing that owners never authenticate on this web platform.

## 3. Identity Lifecycle

| Identity type | Created by | Notes |
|---|---|---|
| Super Admin | Out-of-band internal provisioning, not self-service | **No prior document specifies how the very first Super Admin account is created** — a genuine bootstrap question, flagged here rather than assumed. Reasonable inference only: consistent with A-002 §16's "only Super Admin can create builders," Super Admin accounts themselves plausibly need an even higher-trust provisioning step outside this platform's own UI |
| Builder Organization Owner (first member) | Via the existing Invitation → Approval flow (A-002 §7, US-SA-01/02) | The approved builder's initial admin activates through the same account-activation mechanism as any Supabase Auth signup |
| Builder Organization Admin/Member (subsequent) | Via Organization-internal invitation, reusing the backend's existing `organization_invitations` pattern (`PLATFORM_FOUNDATION_SPECIFICATION.md`) | Not reinvented — this is the same mechanism the backend already built for exactly this purpose |
| Property Owner | Entirely outside this document's scope — the existing Flutter app's own signup/invitation flow | See § Owner Integration in the main document |

## 4. Login Flow

1. Credential submission (Login Gateway, NG-004 PW-09, or direct `/login` on Super Admin/Builder Portal).
2. Supabase Auth validates credentials, issues a session token.
3. Authentication Context resolves (§9) — identity confirmed, nothing about role/Organization yet.
4. Organization Context resolves (main document §6) — gates everything that follows.
5. RBAC permission set resolves (`RBAC_INTEGRATION.md`).
6. Shell renders (NG-001 §14's Bootstrap Strategy — this flow is that sequence, now given full auth-specific detail).

## 5. Logout Flow

Supabase Auth session invalidated → **every** Core-level Signal is cleared, not just Feature-level state (the one deliberate exception to NG-005's "Feature state clears, Core persists" rule — logout is specifically the event that clears Core too, since Core holds the very identity that just ended) → redirect to that application's `/login`.

## 6. Session Lifecycle

Created at login, persists via Supabase Auth's own existing mechanism (NG-005 `CACHE_STRATEGY.md` § Persistence Strategy, restated), refreshed automatically (§7), destroyed at logout or expiry.

## 7. Session Refresh Strategy

Supabase Auth's built-in token refresh handles the common case silently — no re-resolution of Organization Context or RBAC needed for an ordinary refresh. The one scenario needing a defined behavior: if a user's Organization membership genuinely changes mid-session (a rare event — no prior document expects it to be common), this platform does **not** proactively poll for that change (consistent with NG-005's "no background polling by default"); it is detected reactively, on the next navigation or the next RLS denial, whichever comes first.

## 8. Token Lifecycle

Standard Supabase JWT — issued at login, refreshed automatically, invalidated at logout. This document does not redesign the token mechanism itself (Supabase's own); it only defines how the Angular applications consume it, via `shared-auth` (NG-001 §9).

## 9. Authentication Context

A deliberately narrow Signal, holding only: session validity, user id, email. **Nothing about role or Organization lives here** — that separation (into Organization Context and User Context, main document §6/§12) is a real, stated architectural decision (§16, ADR-012), not an oversight.

## 24. Account Recovery

Supabase Auth's existing password-reset mechanism, not redesigned. This document's one addition: account recovery never carries forward stale Organization/permission assumptions — a recovered session re-resolves Organization Context and RBAC exactly as a fresh login would, never trusting anything cached from before recovery.

## 25. Future SSO

Reserved, not designed — no prior document requires it. Because Authentication Context is a narrow, separated layer (§9), adopting SSO later would only need to change how that one Signal gets populated — Organization Context and RBAC would be entirely unaffected, which is itself a benefit of the three-context separation this document establishes (ADR-012).

## 26. Future MFA

Same treatment as SSO — Supabase Auth's own MFA support, if adopted, is entirely an Authentication Context concern and would not touch Organization Context or RBAC at all.
