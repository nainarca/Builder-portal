---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-004 |
| **Document Name** | Screen Flow |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Solution Architect / UX Architect / Product Architect / Business Architect / SaaS Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001, A-002, A-003, A-003A |
| **Referenced Documents** | `A-001-product-vision-scope.md`, `A-002-business-flow.md`, `A-003_User_Journey.md`, `A-003A_User_Stories.md`, `A-003A_Acceptance_Criteria.md` |
| **Previous Document** | A-003A User Stories & Acceptance Criteria |
| **Next Document** | A-005 Navigation Flow |
| **Related ADR** | None yet — see `docs/adr/ADR_INDEX.md` |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`SCREEN_INVENTORY.md`](SCREEN_INVENTORY.md) (flat master list), [`diagrams/A-004_Screen_Flow_Diagrams.md`](diagrams/A-004_Screen_Flow_Diagrams.md) (all diagrams).

---

# A-004 — Screen Flow

## Pre-Check Result

A-001, A-002, A-003, and A-003A were read in full and are treated as source of truth; nothing in any of them is modified or contradicted below. No ADR documents exist. Every screen below is traced to a specific A-003A user story where one exists. **Three screens do not have a dedicated A-003A story** — SA-08 (User Management), SA-10 (Audit Log), BA-13 (Settings/team management) — each is justified instead by an explicit A-002 business-flow step or an A-003A security consideration, and is flagged here rather than silently presented as fully covered (see §14 Risks). No duplicate screens were created — each screen has exactly one owning product and module (§12 Screen Ownership).

---

## 1. Executive Summary

This document enumerates every screen the MyPropertyAsset Web Platform requires — 33 screens across three products (Public Website, Super Admin Portal, Builder Handover Portal), plus five reference points into the existing, unmodified Owner Mobile App. For each screen it defines purpose, audience, entry/exit points, flows, business rules, permissions, and traceability back to A-002/A-003/A-003A — with zero UI design, layout, or technical content, per this document's own constraints (§16).

## 2. Screen Inventory

See [`SCREEN_INVENTORY.md`](SCREEN_INVENTORY.md) for the flat master table. Summary: 9 Public Website + 11 Super Admin + 13 Builder Portal = 33 web screens, plus 5 Owner App reference points (not designed here).

## 3. Screen Hierarchy

```
MyPropertyAsset Web Platform
├── Public Website (unauthenticated)
│   ├── Home → Features / Pricing / About / FAQ
│   ├── Contact / Contact Sales
│   ├── Demo Request
│   ├── Builder Registration
│   └── Login Gateway → (Super Admin Portal | Builder Handover Portal)
├── Super Admin Portal (authenticated, Super Admin only)
│   ├── Login → Dashboard
│   └── Dashboard → Builder Management → Builder Detail & Approval → (White-label | Subscription)
│                 → Organization Management
│                 → User Management
│                 → Platform Monitoring
│                 → Audit Log
│                 → Settings
└── Builder Handover Portal (authenticated, Builder Administrator only, scoped to own Organization)
    ├── Login → Dashboard
    └── Dashboard → Projects → Project Detail → Units → Unit Detail
                                                          ├── Owner Assignment
                                                          ├── Document Upload
                                                          └── (feeds) Invitations Tracking
                  → Documents (Library)
                  → Reports
                  → Notifications
                  → Settings

                              ⇣ (Invitation, Handover)

              Existing Owner Mobile App (unmodified — reference only)
```

Full diagram: `diagrams/A-004_Screen_Flow_Diagrams.md` §1/§9.

## 4. Product Screen Flow (overview)

| Product | Entry | Core Loop | Exit / Handoff |
|---|---|---|---|
| Public Website | Organic/referral/paid | Discover → Evaluate → Convert | Sign-up (owner, off-platform to mobile app), Builder Registration (→ Super Admin), or unconverted exit |
| Super Admin Portal | Direct login (internal) | Review → Approve → Configure → Monitor | Provisions Builder Portal access; ongoing operational use, no "exit" in the product sense |
| Builder Handover Portal | Login (post-approval) | Create → Assign → Invite → Track → Report | Handover completion hands off to the Owner Mobile App |

## 5. Public Website Screens

**Product-level defaults** (stated once, referenced by each screen below unless overridden): **Permissions Required:** none — fully unauthenticated. **Exception Flow default:** content/service temporarily unavailable → graceful non-technical error state, rest of site remains reachable. **Notifications Triggered default:** none, except where stated.

#### PW-01 — Home
| Field | Value |
|---|---|
| Module | Marketing |
| Actor | Public Visitor |
| Purpose | Orient a new visitor and establish the owner-track / builder-track fork |
| Business Goal | Maximize the rate at which visitors reach a relevant next step |
| Entry Point | Organic search, referral, paid acquisition, direct navigation |
| Preconditions | None |
| Screen Description | Landing content communicating the platform's value proposition, with pathways toward Features/Pricing/About and the owner/builder fork |
| Available Actions | Navigate to Features, Pricing, About, FAQ, Contact, Demo Request, Builder Registration, Login Gateway |
| Navigation In | External (search/referral/ads/direct) |
| Navigation Out | PW-02, PW-03, PW-04, PW-05, PW-06, PW-07, PW-08, PW-09 |
| Success Flow | Visitor proceeds to a relevant next screen based on their track |
| Alternate Flow | Visitor arrives via a deep link to a different page and never sees Home at all |
| Exception Flow | Default |
| Business Rules | None beyond A-002 §6 |
| Permissions Required | Default (none) |
| Notifications Triggered | Default (none) |
| Validation Summary | N/A — no data entry |
| Related User Stories | US-PW-01 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | Early, explicit owner/builder fork content (A-003 §12 opportunity) |

#### PW-02 — Features
| Field | Value |
|---|---|
| Module | Marketing |
| Actor | Public Visitor |
| Purpose | Communicate what the platform does in enough depth to support a buy decision |
| Business Goal | Reduce unconverted exits caused by unclear value proposition |
| Entry Point | From Home or direct/deep link |
| Preconditions | None |
| Screen Description | Feature-by-feature explanation of platform capability |
| Available Actions | Navigate onward to Pricing, Demo Request, Contact, Builder Registration |
| Navigation In | PW-01 or external |
| Navigation Out | PW-03, PW-06, PW-07, PW-08 |
| Success Flow | Visitor proceeds toward Pricing or a conversion action |
| Alternate Flow | Visitor exits without converting (still a valid outcome, not an error) |
| Exception Flow | Default |
| Business Rules | None |
| Permissions Required | Default |
| Notifications Triggered | Default |
| Validation Summary | N/A |
| Related User Stories | US-PW-01 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-03 — Pricing
| Field | Value |
|---|---|
| Module | Marketing |
| Actor | Public Visitor |
| Purpose | Support the visitor's evaluation of cost against value |
| Business Goal | Qualify or disqualify visitors quickly and honestly |
| Entry Point | From Home, Features, or direct/deep link |
| Preconditions | None |
| Screen Description | Plan/tier information |
| Available Actions | Navigate to Demo Request, Contact Sales, sign-up (off-platform), Builder Registration |
| Navigation In | PW-01, PW-02, or external |
| Navigation Out | PW-06, PW-07, PW-08 |
| Success Flow | Visitor determines fit and proceeds to a conversion action |
| Alternate Flow | Visitor compares pricing against Features viewed earlier in the same session (client-side session behavior, not designed here) |
| Exception Flow | Default |
| Business Rules | Pricing structure itself is a commercial decision outside this document's scope (A-003A US-PW-02) |
| Permissions Required | Default |
| Notifications Triggered | Default |
| Validation Summary | N/A |
| Related User Stories | US-PW-02 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-04 — About
| Field | Value |
|---|---|
| Module | Marketing |
| Actor | Public Visitor |
| Purpose | Establish credibility/trust |
| Business Goal | Reduce hesitation for visitors evaluating an unfamiliar platform |
| Entry Point | From Home or direct/deep link |
| Preconditions | None |
| Screen Description | Company/product background content |
| Available Actions | Navigate onward to any other Public Website screen |
| Navigation In | PW-01 or external |
| Navigation Out | PW-02, PW-03, PW-06 |
| Success Flow | Visitor's trust is reinforced; proceeds elsewhere in the site |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None |
| Permissions Required | Default |
| Notifications Triggered | Default |
| Validation Summary | N/A |
| Related User Stories | US-PW-01 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-05 — FAQ
| Field | Value |
|---|---|
| Module | Marketing |
| Actor | Public Visitor |
| Purpose | Answer common questions without requiring a sales conversation |
| Business Goal | Reduce Contact Sales/Demo Request volume for easily-answered questions |
| Entry Point | From Home or direct/deep link |
| Preconditions | None |
| Screen Description | Structured question/answer content |
| Available Actions | Navigate onward; escalate to Contact Sales if unanswered |
| Navigation In | PW-01 or external |
| Navigation Out | PW-06 |
| Success Flow | Visitor's question is answered without further contact |
| Alternate Flow | Visitor's question isn't covered — proceeds to Contact Sales |
| Exception Flow | Default |
| Business Rules | None |
| Permissions Required | Default |
| Notifications Triggered | Default |
| Validation Summary | N/A |
| Related User Stories | US-PW-01 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-06 — Contact / Contact Sales
| Field | Value |
|---|---|
| Module | Conversion |
| Actor | Public Visitor |
| Purpose | Capture a general sales inquiry |
| Business Goal | Generate a qualified, actionable lead for MyPropertyAsset's commercial process |
| Entry Point | From any Public Website screen |
| Preconditions | None |
| Screen Description | A form capturing contact details and a message |
| Available Actions | Submit inquiry |
| Navigation In | Any PW screen |
| Navigation Out | Confirmation state (same screen); no forced navigation elsewhere |
| Success Flow | Valid submission → captured, confirmed, routed to MyPropertyAsset's commercial process (A-002 §6) |
| Alternate Flow | Visitor arrives here from builder-track content specifically |
| Exception Flow | Invalid/missing contact detail → rejected with the specific invalid field indicated (AC-PW-04) |
| Business Rules | Lead capture only — never creates a platform account or a Builder Registration as a side effect (US-PW-04) |
| Permissions Required | Default |
| Notifications Triggered | Confirmation to visitor; lead notification to MyPropertyAsset's commercial process |
| Validation Summary | Contact detail (email and/or phone) required and well-formed |
| Related User Stories | US-PW-04 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-07 — Demo Request
| Field | Value |
|---|---|
| Module | Conversion |
| Actor | Public Visitor |
| Purpose | Capture a qualified demo lead |
| Business Goal | Convert evaluation-stage visitors into a guided sales process |
| Entry Point | From Home, Features, or Pricing |
| Preconditions | None |
| Screen Description | A form capturing contact details and demo-scheduling intent |
| Available Actions | Submit request |
| Navigation In | PW-01, PW-02, PW-03 |
| Navigation Out | Confirmation state (same screen) |
| Success Flow | Valid submission → captured, confirmed, routed to commercial process (A-002 §6) |
| Alternate Flow | N/A |
| Exception Flow | Same as PW-06 (AC-PW-03) |
| Business Rules | Lead capture only, no account created (US-PW-03) |
| Permissions Required | Default |
| Notifications Triggered | Confirmation to visitor; lead notification to commercial process |
| Validation Summary | Contact detail required and well-formed |
| Related User Stories | US-PW-03 |
| Related Business Flows | A-002 §6 |
| Future Enhancements | None named |

#### PW-08 — Builder Registration
| Field | Value |
|---|---|
| Module | Conversion |
| Actor | Public Visitor (builder-track) |
| Purpose | Submit a builder registration for Super Admin review |
| Business Goal | Populate the Builder Onboarding pipeline (EPIC-02) with qualified, self-submitted registrations |
| Entry Point | From Home, Features, Pricing, or a sales conversation |
| Preconditions | None |
| Screen Description | A form capturing company and contact information |
| Available Actions | Submit registration |
| Navigation In | PW-01, PW-02, PW-03 |
| Navigation Out | Confirmation state; journey continues in SA-04 (Super Admin side), not on the Public Website |
| Success Flow | Valid submission → a pending Builder Registration exists (US-SA-01), visitor is notified their submission was received |
| Alternate Flow | N/A |
| Exception Flow | Incomplete/invalid submission → rejected with a reason and a retry path (A-002 §15); duplicate company registration → rejected (AC-SA-01) |
| Business Rules | Submission alone grants no platform access — access exists only after Super Admin approval (A-002 §16, "who can create builders") |
| Permissions Required | Default |
| Notifications Triggered | Confirmation to visitor; new-registration notification to Super Admin (feeds SA-02/SA-03) |
| Validation Summary | Company name and a valid contact channel (email or phone) required |
| Related User Stories | US-SA-01 (this screen is the visitor-facing half of that story; the Super Admin-facing half is SA-03/SA-04) |
| Related Business Flows | A-002 §6, §7 |
| Future Enhancements | None named |

#### PW-09 — Login Gateway
| Field | Value |
|---|---|
| Module | Authentication |
| Actor | Returning Builder Administrator or Super Admin |
| Purpose | Route an authenticating user to the correct portal |
| Business Goal | A single, unambiguous entry point for every authenticated surface this platform has |
| Entry Point | From Home, or direct navigation to a login URL |
| Preconditions | None to reach the screen; valid credentials required to proceed past it |
| Screen Description | A credential-entry gateway that, on success, routes the user into SA-02 (if Super Admin) or BA-02 (if Builder Administrator), based on their account's role |
| Available Actions | Authenticate |
| Navigation In | PW-01 or direct |
| Navigation Out | SA-02, BA-02 (never to an Owner Mobile App screen — owners do not authenticate on this web platform, per A-001 §8) |
| Success Flow | Valid credentials → routed to the correct portal's Dashboard |
| Alternate Flow | N/A |
| Exception Flow | Invalid credentials → rejected, no information disclosed about which part was wrong (standard practice, not a new rule); Builder Organization suspended → rejected with a specific reason (AC-BA-01) |
| Business Rules | This screen never authenticates a Property Owner — the Owner Mobile App remains the owner's only authenticated surface (A-001 §8) |
| Permissions Required | Default to reach the screen; valid Super Admin or Builder Administrator credentials to proceed |
| Notifications Triggered | Default (none) |
| Validation Summary | Standard credential validation (existing Supabase Auth mechanism, not redesigned) |
| Related User Stories | US-SA-*, US-BA-01 (shared gateway, not owned by either story set alone) |
| Related Business Flows | A-002 §7, §8 |
| Future Enhancements | None named |

## 6. Super Admin Screens

**Product-level defaults:** **Permissions Required:** Super Admin role only, platform-wide scope. **Exception Flow default:** unauthenticated or non-Super-Admin access attempt → rejected. **Navigation In default:** SA-02 Dashboard, unless stated otherwise.

#### SA-01 — Login
| Field | Value |
|---|---|
| Module | Authentication |
| Actor | Super Admin |
| Purpose | Authenticate into the Super Admin Portal |
| Business Goal | Restrict the platform's highest-privilege surface to legitimate operators only |
| Entry Point | PW-09 Login Gateway |
| Preconditions | Super Admin account already provisioned (out of this document's scope — an internal process) |
| Screen Description | Credential entry, existing Supabase Auth mechanism |
| Available Actions | Authenticate |
| Navigation In | PW-09 |
| Navigation Out | SA-02 |
| Success Flow | Valid credentials → Dashboard |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None beyond default |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Standard credential validation |
| Related User Stories | US-SA-* (all Super Admin stories require this first) |
| Related Business Flows | A-002 §7 |
| Future Enhancements | None named |

#### SA-02 — Dashboard
| Field | Value |
|---|---|
| Module | Overview |
| Actor | Super Admin |
| Purpose | Platform-wide operational snapshot |
| Business Goal | Let the Super Admin identify what needs attention without navigating multiple screens first |
| Entry Point | SA-01 Login |
| Preconditions | Authenticated |
| Screen Description | Summary of pending builder registrations, Organization counts, monitoring highlights, open support items |
| Available Actions | Navigate to any other Super Admin screen |
| Navigation In | SA-01 |
| Navigation Out | SA-03 through SA-11 |
| Success Flow | Super Admin identifies a priority and navigates to act on it |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None beyond default |
| Permissions Required | Default |
| Notifications Triggered | None (displays, does not generate) |
| Validation Summary | N/A — read-only |
| Related User Stories | US-SA-06 (partially — monitoring content), general orientation for all US-SA-* |
| Related Business Flows | A-002 §7 |
| Future Enhancements | None named |

#### SA-03 — Builder Management (List)
| Field | Value |
|---|---|
| Module | Builder Onboarding |
| Actor | Super Admin |
| Purpose | View and find all builder registrations and organizations |
| Business Goal | Give the Super Admin a single place to work the builder-onboarding pipeline |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A list of Builder Registrations/Organizations with status (pending, approved, rejected, suspended) |
| Available Actions | Filter/search; open a specific builder (→ SA-04); manually initiate a new registration (US-SA-01 alternate flow) |
| Navigation In | SA-02 |
| Navigation Out | SA-04 |
| Success Flow | Super Admin locates the builder they need to act on |
| Alternate Flow | Super Admin manually creates a registration rather than reviewing a self-submitted one (US-SA-01 alternate) |
| Exception Flow | Default |
| Business Rules | Only Super Admin can create a builder record (A-002 §16) |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | N/A for the list itself; manual creation requires company name + contact channel (same as PW-08) |
| Related User Stories | US-SA-01 |
| Related Business Flows | A-002 §7 |
| Future Enhancements | None named |

#### SA-04 — Builder Detail & Approval
| Field | Value |
|---|---|
| Module | Builder Onboarding |
| Actor | Super Admin |
| Purpose | Review, approve, or reject a specific builder |
| Business Goal | The single decision point that provisions (or withholds) Builder Portal access |
| Entry Point | SA-03 |
| Preconditions | A Builder Registration exists |
| Screen Description | Full detail of one builder's registration/organization, with an approve/reject action for pending registrations |
| Available Actions | Approve, reject (with reason), and — once approved — navigate to White-label (SA-06) and Subscription (SA-07) configuration for this specific Organization |
| Navigation In | SA-03 |
| Navigation Out | SA-06, SA-07, back to SA-03 |
| Success Flow | Approve → Organization created, admin access provisioned, builder notified (AC-SA-02) |
| Alternate Flow | N/A beyond the approve/reject branch |
| Exception Flow | Reject → prospective builder notified with a reason, no Organization/access created (A-002 §15); attempt to re-decide an already-decided registration → rejected (AC-SA-02) |
| Business Rules | A rejected registration creates no Organization and no access of any kind (A-002 §15) |
| Permissions Required | Default |
| Notifications Triggered | Approval/rejection notification to the builder |
| Validation Summary | A decision requires the registration to be in "pending" state |
| Related User Stories | US-SA-02 |
| Related Business Flows | A-002 §7, §15 |
| Future Enhancements | None named |

#### SA-05 — Organization Management
| Field | Value |
|---|---|
| Module | Tenancy |
| Actor | Super Admin |
| Purpose | View/manage all Organizations, Builder-type and Owner-type alike |
| Business Goal | Confirm the platform's tenancy model is correctly represented, per A-002 §16's resolution that Organization is one shared construct |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A list of Organizations labeled by type, with drill-down to individual Organization detail |
| Available Actions | Filter/search by type; open a specific Organization's detail |
| Navigation In | SA-02 |
| Navigation Out | Organization detail (same screen family — not further decomposed here, per this document's own scope limits) |
| Success Flow | Super Admin confirms every approved builder and activated owner is represented by exactly one Organization record (AC-SA-05) |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Organization is the same construct for both populations — this screen must not present them as unrelated data types (A-002 §16) |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | N/A — administrative visibility only |
| Related User Stories | US-SA-05 |
| Related Business Flows | A-002 §16, A-003A §16 |
| Future Enhancements | The `organization_type` discriminator decision (still open across four documents now) directly shapes this screen's eventual data design |

#### SA-06 — White-label Configuration
| Field | Value |
|---|---|
| Module | Branding |
| Actor | Super Admin |
| Purpose | Configure a Builder Organization's branding presentation |
| Business Goal | Deliver on the platform's white-label vision (A-001 §13) at the one Organization it's being configured for |
| Entry Point | SA-04 (from an approved builder's detail) |
| Preconditions | The target Organization exists and is approved |
| Screen Description | Branding configuration scoped to one Organization (vision-level only — no mechanism is designed by this document, consistent with A-001 §13/A-002 §16) |
| Available Actions | Set/update branding configuration for the Organization |
| Navigation In | SA-04 |
| Navigation Out | Back to SA-04 |
| Success Flow | Configuration applies to the target Organization only, with no effect on any other (AC-SA-03) |
| Alternate Flow | Configuration updated after initial approval, not only at approval time |
| Exception Flow | Attempted configuration of a non-existent or non-Builder-type Organization → rejected |
| Business Rules | White-label applies at the Organization level (A-002 §16) |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Deferred — no field-level rules defined until white-label's actual mechanism is designed |
| Related User Stories | US-SA-03 |
| Related Business Flows | A-001 §13, A-002 §16 |
| Future Enhancements | Self-service configuration by the builder themselves; extension to owner-facing surfaces (A-001 §13) |

#### SA-07 — Subscription Management
| Field | Value |
|---|---|
| Module | Commercial |
| Actor | Super Admin |
| Purpose | Activate or change an Organization's subscription |
| Business Goal | Give the builder Organization commercial standing on the platform |
| Entry Point | SA-04 |
| Preconditions | The target Organization exists and is approved |
| Screen Description | Plan selection/activation scoped to one Organization |
| Available Actions | Activate, change/upgrade a subscription plan |
| Navigation In | SA-04 |
| Navigation Out | Back to SA-04 |
| Success Flow | Organization's subscription status becomes active (AC-SA-04) |
| Alternate Flow | Subscription changed after initial activation |
| Exception Flow | Activation attempted for an unapproved Organization → rejected |
| Business Rules | Subscription is platform-operator-controlled, not self-service, today (A-002 §7) |
| Permissions Required | Default |
| Notifications Triggered | None specified beyond standard commercial confirmation |
| Validation Summary | An Organization has exactly one active subscription state at a time |
| Related User Stories | US-SA-04 |
| Related Business Flows | A-002 §7 |
| Future Enhancements | Self-service subscription management; per-organization billing reconciliation (a known open item from `PLATFORM_FOUNDATION_SPECIFICATION.md`) |

#### SA-08 — User Management *(no dedicated A-003A story — see §14)*
| Field | Value |
|---|---|
| Module | Administration |
| Actor | Super Admin |
| Purpose | Manage platform users across all roles |
| Business Goal | Support and administrative capability without direct database access |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A cross-role user list/detail view |
| Available Actions | Search/view users; administrative actions (exact scope not defined — no backing story) |
| Navigation In | SA-02 |
| Navigation Out | N/A — terminal administrative screen |
| Success Flow | Not fully specifiable without a backing story — recommend one be added to A-003A |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None specified — gap |
| Permissions Required | Default |
| Notifications Triggered | Unknown — gap |
| Validation Summary | Unknown — gap |
| Related User Stories | **None.** Justified by A-002 §7's "User Management" business-flow step only |
| Related Business Flows | A-002 §7 |
| Future Enhancements | Recommend a proper A-003A user story before this screen is designed further |

#### SA-09 — Platform Monitoring
| Field | Value |
|---|---|
| Module | Operations |
| Actor | Super Admin |
| Purpose | Business-level platform health/usage visibility |
| Business Goal | Identify issues before they affect builders or owners |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | Business-level indicators (pending registrations, active Organizations, support backlog) — explicitly not a technical/APM design (A-002 §7) |
| Available Actions | View indicators; drill into a specific area (e.g., pending registrations → SA-03) |
| Navigation In | SA-02 |
| Navigation Out | SA-03, SA-... (contextual, not exhaustively mapped here) |
| Success Flow | Super Admin answers "is the platform healthy right now" without engineering help (US-SA-06 Success Outcome) |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Business-level only, per A-002 §7 |
| Permissions Required | Default |
| Notifications Triggered | None (displays, does not generate) |
| Validation Summary | N/A — read-only |
| Related User Stories | US-SA-06 |
| Related Business Flows | A-002 §7 |
| Future Enhancements | Technical/APM-level monitoring — explicitly out of this document's scope (US-SA-06 Future Considerations) |

#### SA-10 — Audit Log *(no dedicated A-003A story — see §14)*
| Field | Value |
|---|---|
| Module | Operations |
| Actor | Super Admin |
| Purpose | Review a record of Super Admin actions |
| Business Goal | Satisfy the auditability expectation A-003A §6 named ("Super Admin actions... should be assumed auditable") without yet defining the mechanism |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A chronological log of platform-operator actions (approve/reject, subscription changes, white-label changes, etc.) |
| Available Actions | Search/filter the log |
| Navigation In | SA-02 |
| Navigation Out | N/A — terminal screen |
| Success Flow | Not fully specifiable without a backing story |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None specified — gap |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | N/A — read-only |
| Related User Stories | **None.** Justified by A-003A §6 Security Considerations only |
| Related Business Flows | A-003A §6 |
| Future Enhancements | Recommend a proper A-003A user story before this screen is designed further |

#### SA-11 — Settings
| Field | Value |
|---|---|
| Module | Administration |
| Actor | Super Admin |
| Purpose | Super Admin's own account/platform-level settings |
| Business Goal | Standard account administration, distinct from any single Organization's settings |
| Entry Point | SA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | Account/profile and platform-level configuration not owned by any single Organization |
| Available Actions | Update account settings |
| Navigation In | SA-02 |
| Navigation Out | N/A |
| Success Flow | Settings saved |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None beyond default |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Standard field-level validation, existing account mechanism |
| Related User Stories | None named directly — general platform administration |
| Related Business Flows | A-002 §7 |
| Future Enhancements | None named |

## 7. Builder Portal Screens

**Product-level defaults:** **Permissions Required:** Builder Administrator (or authorized team member) role, strictly scoped to the user's own Organization — cross-Organization access must be structurally impossible, not merely hidden (A-003A §6). **Exception Flow default:** unauthenticated, non-Builder role, or cross-Organization access attempt → rejected. **Navigation In default:** BA-02 Dashboard, unless stated otherwise.

#### BA-01 — Login
| Field | Value |
|---|---|
| Module | Authentication |
| Actor | Builder Administrator |
| Purpose | Authenticate into the Builder Handover Portal |
| Business Goal | Restrict portal access to approved, active builder organizations only |
| Entry Point | PW-09 Login Gateway |
| Preconditions | Builder Organization approved and admin account activated (SA-04) |
| Screen Description | Credential entry, existing Supabase Auth mechanism |
| Available Actions | Authenticate |
| Navigation In | PW-09 |
| Navigation Out | BA-02 |
| Success Flow | Valid credentials → placed in own Organization's scoped context (AC-BA-01) |
| Alternate Flow | N/A |
| Exception Flow | Organization suspended → rejected with a specific reason, not a generic failure (AC-BA-01) |
| Business Rules | Default |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Standard credential validation |
| Related User Stories | US-BA-01 |
| Related Business Flows | A-002 §8 |
| Future Enhancements | None named |

#### BA-02 — Dashboard
| Field | Value |
|---|---|
| Module | Overview |
| Actor | Builder Administrator |
| Purpose | Organization-wide handover progress snapshot |
| Business Goal | Let Priya (A-003 persona) see her overall status without checking each unit individually |
| Entry Point | BA-01 Login |
| Preconditions | Authenticated |
| Screen Description | Summary of projects, units, and handover progress across the Organization |
| Available Actions | Navigate to any other Builder Portal screen |
| Navigation In | BA-01 |
| Navigation Out | BA-03 through BA-13 |
| Success Flow | Builder identifies what needs attention and navigates to act |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Default |
| Permissions Required | Default |
| Notifications Triggered | None (displays, does not generate) |
| Validation Summary | N/A — read-only |
| Related User Stories | General orientation for all US-BA-* |
| Related Business Flows | A-002 §8 |
| Future Enhancements | None named |

#### BA-03 — Projects (List)
| Field | Value |
|---|---|
| Module | Project & Unit Preparation |
| Actor | Builder Administrator |
| Purpose | View/find the Organization's projects |
| Business Goal | Organize handover work by construction/development effort |
| Entry Point | BA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A list of projects belonging to the builder's own Organization |
| Available Actions | Create a new project (→ BA-04); open an existing project |
| Navigation In | BA-02 |
| Navigation Out | BA-04 |
| Success Flow | Project created, visible only within the creating Organization (AC-BA-02) |
| Alternate Flow | N/A |
| Exception Flow | Missing required project information → rejected with field-level feedback |
| Business Rules | This screen is the business-process counterpart of the still-undesigned backend Builder Projects domain (A-002 §8, A-003A §7 dependency — see §14 Risks) |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Project name required at minimum; further rules deferred to the Builder Projects data-architecture document |
| Related User Stories | US-BA-02 |
| Related Business Flows | A-002 §8 |
| Future Enhancements | None named beyond the flagged backend dependency |

#### BA-04 — Project Detail
| Field | Value |
|---|---|
| Module | Project & Unit Preparation |
| Actor | Builder Administrator |
| Purpose | Manage a single project and its units |
| Business Goal | A scoped workspace for one development effort |
| Entry Point | BA-03 |
| Preconditions | Project exists |
| Screen Description | Project-level detail with entry into its Units list |
| Available Actions | Edit project detail; navigate to Units (→ BA-05) |
| Navigation In | BA-03 |
| Navigation Out | BA-05 |
| Success Flow | Builder reaches the project's units |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Same Builder Projects domain dependency as BA-03 |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Same as BA-03 for any edits |
| Related User Stories | US-BA-02 |
| Related Business Flows | A-002 §8 |
| Future Enhancements | None named |

#### BA-05 — Units (List)
| Field | Value |
|---|---|
| Module | Project & Unit Preparation |
| Actor | Builder Administrator |
| Purpose | View/find units within a project |
| Business Goal | Individually addressable properties ready to progress through the handover lifecycle |
| Entry Point | BA-04 |
| Preconditions | Project exists |
| Screen Description | A list of units belonging to the project, each showing its current lifecycle state (A-002 §12) |
| Available Actions | Create a new unit (→ BA-06); open an existing unit |
| Navigation In | BA-04 |
| Navigation Out | BA-06 |
| Success Flow | Unit created in "Draft" state, linked to exactly one project (AC-BA-03) |
| Alternate Flow | Multiple units created in bulk (A-003A US-BA-03 alternate) |
| Exception Flow | Unit creation attempted against a project outside the builder's own Organization → rejected |
| Business Rules | Same Builder Projects domain dependency as BA-03 |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | Unit identifier/name required |
| Related User Stories | US-BA-03 |
| Related Business Flows | A-002 §8, §12 |
| Future Enhancements | None named |

#### BA-06 — Unit Detail
| Field | Value |
|---|---|
| Module | Project & Unit Preparation / Handover |
| Actor | Builder Administrator |
| Purpose | Central hub for one unit's lifecycle, assignment, documents, and invitation status |
| Business Goal | A single place to see and act on everything relevant to handing over this specific unit |
| Entry Point | BA-05 |
| Preconditions | Unit exists |
| Screen Description | Unit-level detail showing lifecycle state (A-002 §12: Draft → Under Construction → Ready for Handover → Assigned → Invited → Accepted/Needs Reassignment → Handed Over), with entry points to Owner Assignment and Document Upload, and inline invitation-status display |
| Available Actions | Progress lifecycle state; navigate to Owner Assignment (→ BA-07); navigate to Document Upload (→ BA-08); view invitation status (reflects BA-09) |
| Navigation In | BA-05 |
| Navigation Out | BA-07, BA-08 |
| Success Flow | Unit progresses correctly through its lifecycle to "Handed Over" (A-002 §12 state diagram) |
| Alternate Flow | Unit returns to "Needs Reassignment" (owner declined/invitation expired) and is reassigned from here |
| Exception Flow | Unit outside the builder's own Organization → rejected |
| Business Rules | "When builders lose access" (A-002 §16) — this screen's write access to a "Handed Over" unit ends immediately, converting to read-only (AC-BA-08) |
| Permissions Required | Default; read-only once the unit is "Handed Over" |
| Notifications Triggered | None generated here directly (generated by BA-07/BA-08/system events) |
| Validation Summary | N/A at this screen's own level — validation lives in BA-07/BA-08 |
| Related User Stories | US-BA-04, US-BA-06, US-BA-07, US-BA-08 (this screen is the shared hub for all four) |
| Related Business Flows | A-002 §8, §10, §12 |
| Future Enhancements | Document-level (not just unit-level) status visibility (A-003 §12 opportunity) |

#### BA-07 — Owner Assignment
| Field | Value |
|---|---|
| Module | Handover Preparation |
| Actor | Builder Administrator |
| Purpose | Link a prospective owner to a unit |
| Business Goal | Prepare the correct handover before formally inviting the owner |
| Entry Point | BA-06 |
| Preconditions | Unit is "Ready for Handover" |
| Screen Description | A form capturing the prospective owner's identifying contact detail |
| Available Actions | Assign, reassign |
| Navigation In | BA-06 |
| Navigation Out | Back to BA-06 |
| Success Flow | Unit moves to "Assigned" state (AC-BA-04) |
| Alternate Flow | Reassignment of a unit that returned to "Needs Reassignment" |
| Exception Flow | Unit already has an active assignment → rejected (A-002 §16, "at most one active prospective-owner assignment at a time") |
| Business Rules | This is a data link based on the builder's own external sales records — the platform is never the system of record for the sale itself (A-002 §8, CRM/Sales exclusion) |
| Permissions Required | Default |
| Notifications Triggered | None (assignment alone does not notify the owner — that's BA-09/invitation) |
| Validation Summary | Valid contact channel (email or phone) required |
| Related User Stories | US-BA-04 |
| Related Business Flows | A-002 §8, §16 |
| Future Enhancements | None named |

#### BA-08 — Document Upload
| Field | Value |
|---|---|
| Module | Handover Preparation |
| Actor | Builder Administrator |
| Purpose | Upload handover documents against a unit |
| Business Goal | A complete handover document package before the owner is ever invited |
| Entry Point | BA-06 |
| Preconditions | Unit exists |
| Screen Description | A document upload interface scoped to one unit |
| Available Actions | Upload one or more documents |
| Navigation In | BA-06 |
| Navigation Out | Back to BA-06; also reachable from/reflected in BA-10 (Documents Library) |
| Success Flow | Document stored as "Builder-owned, Owner-pending" — not visible to any owner (A-002 §13, AC-BA-05) |
| Alternate Flow | Additional documents uploaded after the initial batch, before invitation |
| Exception Flow | Upload attempted against a unit outside the builder's own Organization → rejected |
| Business Rules | Document ownership transfers, never duplicates, at handover acceptance (A-002 §13) — this screen is the "before" state of that rule |
| Permissions Required | Default; no owner (even the eventually-assigned one) can access these documents before acceptance |
| Notifications Triggered | None |
| Validation Summary | Deferred — file-type/size rules are a future, technical concern, not defined here |
| Related User Stories | US-BA-05 |
| Related Business Flows | A-002 §8, §13 |
| Future Enhancements | Document-level completeness indicators (A-003 §12 opportunity) |

#### BA-09 — Invitations (Tracking)
| Field | Value |
|---|---|
| Module | Handover |
| Actor | Builder Administrator |
| Purpose | Track invitation status across units |
| Business Goal | Answer the pain point named in A-003 §11 — knowing whether to wait, follow up, or reassign |
| Entry Point | BA-02 Dashboard, or inline from BA-06 |
| Preconditions | At least one invitation has been sent |
| Screen Description | A cross-unit list of invitations with status (pending, accepted, declined, expired) |
| Available Actions | Send a new invitation (from an "Assigned" unit); resend an about-to-expire invitation |
| Navigation In | BA-02, BA-06 |
| Navigation Out | BA-06 (for a specific unit's detail) |
| Success Flow | Displayed status always matches the invitation's actual current state (AC-BA-07) |
| Alternate Flow | Builder resends an about-to-expire invitation |
| Exception Flow | Invitation attempted for a unit that already has an active, unexpired invitation → rejected (A-002 §15); unit not yet "Assigned" → invitation attempt rejected |
| Business Rules | Only an authorized user within an approved Builder's own Organization can invite, and only for a unit already assigned to that Organization's own project (A-002 §16) |
| Permissions Required | Default |
| Notifications Triggered | Invitation delivered to the owner (US-PO-01); expiry notification to the builder |
| Validation Summary | Unit must be in "Assigned" state before an invitation can be sent |
| Related User Stories | US-BA-06, US-BA-07 |
| Related Business Flows | A-002 §8, §11, §15 |
| Future Enhancements | None named |

#### BA-10 — Documents (Library)
| Field | Value |
|---|---|
| Module | Handover |
| Actor | Builder Administrator |
| Purpose | Cross-project document index |
| Business Goal | Find any uploaded document without navigating through its specific unit |
| Entry Point | BA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A searchable index of documents across the Organization's units, complementing BA-08's per-unit upload |
| Available Actions | Search/filter; open the owning unit (→ BA-06) |
| Navigation In | BA-02 |
| Navigation Out | BA-06 |
| Success Flow | Builder locates a specific document without unit-by-unit navigation |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Same transfer-not-duplication rule as BA-08/A-002 §13 |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | N/A — read/search only |
| Related User Stories | US-BA-05 (extends it to a cross-project view) |
| Related Business Flows | A-002 §13 |
| Future Enhancements | None named |

#### BA-11 — Reports
| Field | Value |
|---|---|
| Module | Reporting |
| Actor | Builder Administrator |
| Purpose | Aggregate handover-progress reporting |
| Business Goal | Answer "how is my handover program going" without manual reconciliation (US-BA-09 Success Outcome) |
| Entry Point | BA-02 Dashboard |
| Preconditions | At least one project with units |
| Screen Description | Aggregate handover status (counts by lifecycle state) across the Organization's projects, filterable by project |
| Available Actions | View aggregate figures; filter by project |
| Navigation In | BA-02 |
| Navigation Out | N/A — terminal reporting screen |
| Success Flow | Reported figures reconcile exactly with underlying unit-level statuses (AC-BA-09) |
| Alternate Flow | Filtered to a specific project |
| Exception Flow | Default |
| Business Rules | Scoped entirely to the Builder's own Organization — never aggregates across builders |
| Permissions Required | Default |
| Notifications Triggered | None |
| Validation Summary | N/A — read-only |
| Related User Stories | US-BA-09 |
| Related Business Flows | A-002 §8 |
| Future Enhancements | Report design detail is explicitly future scope (US-BA-09 Future Considerations) |

#### BA-12 — Notifications
| Field | Value |
|---|---|
| Module | Communication |
| Actor | Builder Administrator |
| Purpose | Builder-side notification center |
| Business Goal | Surface invitation and handover-milestone events in one place |
| Entry Point | BA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | A list of notifications: invitation accepted/declined, invitation expiring, handover complete (A-002 §14) |
| Available Actions | View/dismiss notifications |
| Navigation In | BA-02 |
| Navigation Out | BA-06 (contextual, for the relevant unit) |
| Success Flow | Builder stays informed without polling BA-09 manually |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | Trigger set is exactly A-002 §14's Builder-facing rows |
| Permissions Required | Default |
| Notifications Triggered | N/A — this screen displays notifications, it doesn't generate new ones |
| Validation Summary | N/A |
| Related User Stories | US-BA-07, US-BA-08 |
| Related Business Flows | A-002 §14 |
| Future Enhancements | None named |

#### BA-13 — Settings *(no dedicated A-003A story — see §14)*
| Field | Value |
|---|---|
| Module | Administration |
| Actor | Builder Administrator |
| Purpose | Organization profile and team member management |
| Business Goal | Standard organization administration |
| Entry Point | BA-02 Dashboard |
| Preconditions | Authenticated |
| Screen Description | Organization profile fields and team member list/management |
| Available Actions | Update profile; manage team members (exact scope not defined — no backing story) |
| Navigation In | BA-02 |
| Navigation Out | N/A |
| Success Flow | Not fully specifiable without a backing story — recommend one be added to A-003A |
| Alternate Flow | N/A |
| Exception Flow | Default |
| Business Rules | None specified — gap |
| Permissions Required | Default; team-member-level permission granularity is undefined (A-003 §3 already flagged this as a future authorization design question) |
| Notifications Triggered | Unknown — gap |
| Validation Summary | Unknown — gap |
| Related User Stories | **None.** Justified by A-002 §8's "Settings" flow step only |
| Related Business Flows | A-002 §8 |
| Future Enhancements | Recommend a proper A-003A user story before this screen is designed further |

## 8. Owner App Interaction Points

Per instruction, the existing Owner Mobile App is **not redesigned** here. See `SCREEN_INVENTORY.md`'s Owner App Interaction Points table for the five reference points (account activation, property acceptance/handover review, document access, existing financial features, notifications). The only genuinely new mobile-side screen implied by this initiative — a handover review/acceptance screen (OA-REF-02) — belongs to a future mobile-specific document, not this one, which governs the web platform only.

## 9. Entry Points

| Product | Entry Points |
|---|---|
| Public Website | Organic search, referral, paid acquisition, direct navigation, deep links |
| Super Admin Portal | PW-09 Login Gateway only (no public entry) |
| Builder Handover Portal | PW-09 Login Gateway only (no public entry); a builder's very first entry is gated by SA-04 approval |
| Owner Mobile App (reference) | Existing self-serve entry (unchanged) + new invitation-link entry (US-PO-01) |

## 10. Exit Points

| Product | Exit Points |
|---|---|
| Public Website | Sign-up (owner, off-platform), Builder Registration submitted, demo/pricing inquiry submitted, unconverted exit |
| Super Admin Portal | No product "exit" — ongoing operational tool; session ends at logout |
| Builder Handover Portal | Handover completion hands the unit off to the Owner Mobile App (BA-06/BA-08 → OA-REF-02); session ends at logout |
| Owner Mobile App (reference) | Not this document's concern beyond the handoff point |

## 11. Business Rules

This document does not restate A-002 §16 or A-003A §4 wholesale — every screen above references the specific rule it depends on inline. No rule is newly introduced by this document that A-002/A-003A didn't already establish.

## 12. Permissions

| Product | Default Permission Model | Cross-tenant Isolation |
|---|---|---|
| Public Website | None — unauthenticated | N/A |
| Super Admin Portal | Super Admin role, platform-wide | N/A — Super Admin is intentionally platform-wide |
| Builder Handover Portal | Builder Administrator (or authorized team member) role, scoped to own Organization | Must be structurally enforced, not UI-hidden (A-003A §6) |

**Screen ownership check (pre-check requirement):** every screen above belongs to exactly one product and module; no screen appears twice in the inventory (verified against `SCREEN_INVENTORY.md`).

## 13. Cross References

| This document | A-002 | A-003 | A-003A |
|---|---|---|---|
| Public Website screens | §6 | §5 | EPIC-01 |
| Super Admin screens | §7 | §6 | EPIC-02 |
| Builder Portal screens | §8, §10, §11 | §7 | EPIC-03, EPIC-04, EPIC-05 |
| Owner App reference points | §9 | §8 | EPIC-06 |

## 14. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Three screens (SA-08, SA-10, BA-13) have no backing A-003A user story | Their success/exception flows, business rules, and validation are underspecified | Flagged explicitly in each screen's own table rather than silently filled in; recommend A-003A be extended with the missing stories before A-005/A-006 design against these screens in detail |
| BA-03/BA-04/BA-05/BA-06 (Projects/Units) all depend on the still-undesigned backend Builder Projects domain | Fourth consecutive document (A-002 → A-003 → A-003A → A-004) carrying this dependency without resolution | Restated again; recommend this become a hard prerequisite for A-006 (Functional Modules), not another deferral |
| SA-06 White-label Configuration has no defined mechanism | Its screen spec is necessarily shallow | Acknowledged in the screen's own entry, consistent with A-003A's own treatment of the same story |

## 15. Assumptions

- Every screen not explicitly flagged in §14 has sufficient backing (a specific A-003A story) to be considered complete at this document's level of detail.
- The Owner Mobile App requires no redesign to accommodate a handover-originated property (carried from A-002 §19/A-003 §17/A-003A §10) — restated here because §8's reference points depend on it holding.
- A single Login Gateway (PW-09) correctly serves both Super Admin and Builder Administrator authentication without needing separate public login screens per portal.

## 16. Constraints

- No UI design, wireframes, Angular, routing, components, APIs, SQL, database, folder structure, CSS, or responsive design content appears anywhere in this document (explicit Quality Rule).
- The Builder Portal exclusion list (CRM/Sales/Accounting/Inventory/HR/Payroll/Procurement/Society Management) constrains every Builder Portal screen in §7 exactly as it constrained A-002 §8, A-003 §7, and A-003A EPIC-03/04/05.
- No screen was created without being traceable to at least an A-002 business-flow step, even where an A-003A story is missing (§14).

## 17. Future Screens

- A proper Team Member Management screen once BA-13 has a backing story (may split from Settings).
- A dedicated Audit Log detail/export view once SA-10 has a backing story.
- A self-service White-label configuration screen for builders themselves (SA-06 Future Enhancements).
- A mobile-side handover review/acceptance screen (OA-REF-02) — belongs to a future Owner Mobile App document, not this series.
- Tenant-facing screens, once the future Tenant Mobile App is scoped (A-003 §9, A-003A §3.5).

## 18. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-004 entry. No prior document was overwritten.

## 19. Updated ADR List

**Not required.** This document introduces no new technical/architectural decision. See `docs/adr/ADR_INDEX.md` — unchanged.

## 20. Review Checklist

- [ ] All 33 screens reviewed for completeness against A-002/A-003/A-003A
- [ ] Three story-less screens (SA-08, SA-10, BA-13) acknowledged as gaps requiring A-003A follow-up, not accepted as fully specified
- [ ] Builder Projects backend dependency (BA-03 through BA-06) acknowledged as blocking for A-006
- [ ] Screen ownership (§12) confirmed — no screen duplicated across products

## 21. Approval Checklist

- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Reviewed by UX Architect / Product Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-005 (Navigation Flow) authorized to begin
