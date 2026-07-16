# STAB-02 — Angular Web Migration Removal Checklist

| Field | Value |
|---|---|
| **Repository** | `my-property-asset-web` |
| **Status** | **CHECKLIST ONLY — no files deleted** |
| **Date** | 2026-07-16 |
| **Prerequisite** | STAB-02 migrations applied on remote from `my_property_asset` |
| **Rule** | This repository is a **database consumer only** after cutover |

---

## Purpose

After Flutter Database Master migrations are applied and verified, remove Angular’s parallel migration ownership so there is a single migration history.

**Do not execute this checklist until STAB-02 apply is approved and Local = Remote through `20260717000013`.**

---

## A. Files to archive (do not delete permanently on first pass)

Move (or copy then delete) from active apply path:

### Apply migrations

```
supabase/migrations/20260716100000_p6a_b01a_platform_foundation.sql
supabase/migrations/20260716110000_p6b_platform_security.sql
supabase/migrations/20260716120000_p7_b02_builder_organization.sql
supabase/migrations/20260716130000_p8_b03_builder_projects.sql
supabase/migrations/20260716140000_p9_b04_builder_buildings.sql
supabase/migrations/20260716150000_p91_b05_project_hierarchy.sql
supabase/migrations/20260716180000_p12_b08_digital_handover_owner_activation.sql
supabase/migrations/20260716190000_p13_b09_white_label_branding.sql
supabase/migrations/20260716200000_p14_b11_builder_communication_hub.sql
supabase/migrations/20260716210000_p15_b10_subscription_billing.sql
supabase/migrations/20260716220000_p16_b12_platform_management.sql
```

### Verify scripts

```
supabase/migrations/verify/20260716100000_p6a_b01a_platform_foundation_verify.sql
supabase/migrations/verify/20260716110000_p6b_platform_security_verify.sql
supabase/migrations/verify/20260716120000_p7_b02_builder_organization_verify.sql
supabase/migrations/verify/20260716130000_p8_b03_builder_projects_verify.sql
supabase/migrations/verify/20260716140000_p9_b04_builder_buildings_verify.sql
supabase/migrations/verify/20260716150000_p91_b05_project_hierarchy_verify.sql
supabase/migrations/verify/20260716180000_p12_b08_digital_handover_owner_activation_verify.sql
supabase/migrations/verify/20260716190000_p13_b09_white_label_branding_verify.sql
supabase/migrations/verify/20260716200000_p14_b11_builder_communication_hub_verify.sql
supabase/migrations/verify/20260716210000_p15_b10_subscription_billing_verify.sql
supabase/migrations/verify/20260716220000_p16_b12_platform_management_verify.sql
```

**Suggested archive path:**

```
docs/database/archived-migrations/20260716-pre-consolidation/
docs/database/archived-migrations/20260716-pre-consolidation/verify/
```

---

## B. Repository hygiene after archive

- [ ] Add `supabase/README.md` stating: **Database consumer only — migrations live in `my_property_asset`**
- [ ] Remove or empty active `supabase/migrations/` apply folder (keep folder with README if tooling expects it)
- [ ] Ensure CI / scripts never run `supabase db push` / `migration up` from this repo
- [ ] Update architecture docs (P5, etc.) to point to Flutter master migrations
- [ ] Align Angular app code with consolidated schema:
  - [ ] Billing reads extended `subscription_plans` (`audience`/`code`) + `organization_subscriptions`
  - [ ] Audit writes use `platform_audit_logs` / `write_audit_event`
  - [ ] Branding uses `organization_branding` (not `organization_settings` branding columns as source of truth)
- [ ] Do **not** link a second Supabase CLI project for migrations from Angular

---

## C. Explicitly do NOT do

- Do not `supabase db push` from Angular against the shared project
- Do not re-create `20260716*` apply migrations in Angular
- Do not rename Flutter applied timestamps
- Do not delete Flutter `audit_logs` or recreate colliding `subscription_*` tables

---

## D. Verification after cutover

- [ ] Angular repo has **zero** pending apply SQL under `supabase/migrations/`
- [ ] Flutter `migration list --linked` remains Local = Remote
- [ ] Angular portal connects to same Supabase URL and reads builder objects successfully

---

## E. Ownership statement

| Concern | Owner |
|---|---|
| DDL / migrations | `my_property_asset` only |
| Angular app code | `my-property-asset-web` |
| Shared database | One Supabase project; one history |
