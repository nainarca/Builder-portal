# Search Architecture — MyPropertyAsset Web Platform

**Companion to:** [`A-007_Information_Architecture.md`](A-007_Information_Architecture.md)
**Purpose:** What is searchable, by whom, and within what boundary. No search mechanism (indexing technology, query syntax, ranking) is designed here — that's implementation detail, out of this document's scope.

## Global Search Strategy

**There is no cross-product global search.** Consistent with A-005 §12 (Search Navigation) and Role Based Navigation (A-005 §8): a Super Admin's search never reaches into Builder Portal or Owner data beyond what Super Admin's own screens (Organization Management, Builder Management) already expose; a Builder's search never reaches another Organization's data or the Public Website's lead records. "Global" here means global *within a product*, not across the platform.

## Per-Domain Searchability

| Domain | Searchable By | Search Scope | Search Fields (business-level, not technical) |
|---|---|---|---|
| ID-01 Public Marketing & Lead Info | No end-user search (FAQ may have in-page filtering, a UI concern not designed here) | N/A | N/A |
| ID-02 Builder Onboarding | Super Admin | Platform-wide (all registrations) | Company name, status, submission date |
| ID-03 Organization & Tenancy | Super Admin | Platform-wide (all Organizations) | Name, type (Builder/Owner), status |
| ID-04 White-label & Branding | Super Admin | Per-Organization (no cross-Organization search) | Not applicable — configuration is looked up by Organization, not searched |
| ID-05 Subscription & Commercial | Super Admin | Platform-wide | Organization name, plan, status |
| ID-06 Platform Operations (Monitoring) | Super Admin | Platform-wide | Not applicable — dashboard indicators, not a searchable list |
| ID-06 Platform Operations (Audit) | Super Admin | Platform-wide | Actor, action type, date range *(no backing story — search requirements undefined, A-007 §16)* |
| ID-07 Project & Unit | Builder Administrator | Own Organization only | Project name, unit identifier, lifecycle state |
| ID-08 Owner Assignment & Prospect | Builder Administrator | Own Organization only | Prospect name/contact, associated unit |
| ID-09 Handover Document | Builder Administrator (pre-handover); Property Owner (post-handover, via existing Property Documents search) | Own Organization only (Builder); own property only (Owner) | Document type, owning unit/property |
| ID-10 Invitation | Builder Administrator | Own Organization only | Unit, status, expiry |
| ID-11 Notification | Each recipient, their own | Own notifications only | Trigger type, date |
| ID-12 Reporting & Analytics | Builder Administrator (own Org); Super Admin (platform-wide) | As stated | Project/date filters |
| ID-13 Owner Financial & Property (reference) | Property Owner | Own properties only — existing, unmodified search behavior | Not redesigned here |
| ID-14 User Identity & Access | Super Admin (platform-wide user search) | Platform-wide | Name, email, role |
| ID-15 Future Tenant | Not designed | — | — |

## Cross-Domain Search Boundaries

- No search ever crosses from one Builder Organization's data into another's (structural isolation, matching A-004/A-005's permission model).
- No search ever surfaces Owner financial data (ID-13) to a Builder or Super Admin — this mirrors the backend's existing "managers never see financial data" rule, applied here at the search layer specifically so it isn't accidentally reintroduced by a future search implementation that doesn't know about that rule.
- Pre-handover documents (ID-09) are never searchable by the assigned-but-not-yet-accepted owner — search respects the same visibility boundary as direct navigation (A-004 §7 BA-08).

## Future Scalability

A platform-wide search spanning Super Admin's view across all Organizations (distinct from any single Builder's or Owner's search) is a plausible future capability, since Super Admin already has platform-wide read access for administrative purposes (A-004 §12) — not designed further here, named only as a non-breaking future extension of the existing per-domain model.
