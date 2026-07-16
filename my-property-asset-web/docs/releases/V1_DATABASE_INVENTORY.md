# V1 Database Inventory

## Migration Files

| File | Purpose |
|---|---|
| `20260716100000_p6a_b01a_platform_foundation.sql` | Orgs, helpers, foundation |
| `20260716110000_p6b_platform_security.sql` | Security helpers / RLS foundations |
| `20260716120000_p7_b02_builder_organization.sql` | Builder companies |
| `20260716130000_p8_b03_builder_projects.sql` | Projects |
| `20260716140000_p9_b04_builder_buildings.sql` | Buildings |
| `20260716150000_p91_b05_project_hierarchy.sql` | Hierarchy enhancement (not units) |
| `20260716180000_p12_b08_digital_handover_owner_activation.sql` | Handover + invitations |
| `20260716190000_p13_b09_white_label_branding.sql` | Organization branding |
| `20260716200000_p14_b11_builder_communication_hub.sql` | Announcements |
| `20260716210000_p15_b10_subscription_billing.sql` | Plans / subscriptions / invoices / payments |
| `20260716220000_p16_b12_platform_management.sql` | Audit / support / settings / flags |

Each has a matching script under `supabase/migrations/verify/`.

## Key Tables (by domain)

| Domain | Tables |
|---|---|
| Foundation | `organizations`, helpers `is_builder_org` |
| Builder | `builder_companies`, projects, buildings, hierarchy objects |
| Handover | handover docs/invitations/activation (depends on units/owners) |
| Branding | `organization_branding` (+ storage seed) |
| Comms | `announcement_campaigns`, deliveries, audit events |
| Billing | `subscription_plans`, `organization_subscriptions`, invoices, payments |
| Platform | `audit_logs`, `support_tickets`, `platform_settings`, `platform_feature_flags`, `global_announcements`, `support_access_grants` |

## Gaps

| Expected (P5) | Status |
|---|---|
| `builder_units` (B05) | **Missing migration** |
| Owner assignment tables (B06) | **Missing migration** |
| Dedicated B07 invitations | Partially absorbed into B08 |
| RLS on B08–B12 | **Missing** |

## Functions / Triggers

| Object | Notes |
|---|---|
| `is_builder_org` | Foundation |
| Scope triggers on builder-scoped tables | Org type enforcement |
| `write_audit_event` | P16 audit helper |
| Active subscription unique index | One active/trial/pending per org |

## Rollback

Forward-only SQL. Operational rollback is restore-from-backup or targeted `DROP` under change control — see `V1_ROLLBACK_GUIDE.md`.
