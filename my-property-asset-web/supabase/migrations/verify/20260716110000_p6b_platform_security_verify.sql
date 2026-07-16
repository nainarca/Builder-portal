-- =============================================================================
-- P6B — Verification SQL
-- Run AFTER:
--   20260716100000_p6a_b01a_platform_foundation.sql
--   20260716110000_p6b_platform_security.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- A. Role catalog verification
-- -----------------------------------------------------------------------------

SELECT role_code, role_family, is_web_portal_role, is_flutter_role
FROM public.platform_role_catalog
ORDER BY role_code;

-- Expected rows: builder_admin, builder_owner, builder_staff, owner, super_admin, tenant

SELECT
  public.normalize_platform_role('owner') AS n_owner,
  public.normalize_platform_role('super-admin') AS n_super_alias,
  public.normalize_platform_role('builder-org-owner') AS n_builder_owner_alias,
  public.normalize_platform_role('builder-org-member') AS n_builder_staff_alias,
  public.is_personal_owner_role('owner') AS owner_ok,
  public.is_builder_platform_role('builder_staff') AS staff_ok,
  public.is_valid_platform_role('owner') AS valid_owner,
  public.is_valid_platform_role('nope') AS invalid_role;

-- Expected: n_owner=owner, aliases map correctly, owner_ok=true, invalid_role=false

-- -----------------------------------------------------------------------------
-- B. Tables / views / functions exist
-- -----------------------------------------------------------------------------

SELECT to_regclass('public.platform_role_catalog') AS role_catalog;
SELECT to_regclass('public.platform_operators') AS platform_operators;

SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN (
    'v_platform_users',
    'v_builder_members',
    'v_super_admin_users',
    'v_personal_organizations',
    'v_builder_organizations'
  )
ORDER BY table_name;

SELECT p.proname
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'normalize_platform_role',
    'is_super_admin',
    'is_platform_operator',
    'is_builder_member',
    'is_builder_owner',
    'is_builder_admin',
    'get_current_organization',
    'get_current_builder',
    'can_access_builder_org',
    'can_access_personal_org',
    'has_builder_role',
    'has_platform_permission_scope'
  )
ORDER BY p.proname;

-- -----------------------------------------------------------------------------
-- C. RLS verification (foundation tables only)
-- -----------------------------------------------------------------------------

SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('platform_role_catalog', 'platform_operators')
ORDER BY c.relname;

-- Expected: rls_enabled = true for both

SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('platform_role_catalog', 'platform_operators')
ORDER BY tablename, policyname;

-- -----------------------------------------------------------------------------
-- D. Confirm NO new policies forced onto Flutter financial tables by this batch
--     (counts may be >0 from Schema V2 already — we only assert tables still exist)
-- -----------------------------------------------------------------------------

SELECT c.relname AS table_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'organizations',
    'organization_members',
    'properties',
    'loans',
    'expenses',
    'tenants',
    'financial_history'
  )
ORDER BY c.relname;

-- P6B must not have dropped these tables.

-- Policies created by P6B are only on platform_* tables:
SELECT COUNT(*) AS non_platform_policies_named_p6b
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'platform_%'
  AND tablename NOT IN ('platform_role_catalog', 'platform_operators');

-- Expected: 0

-- -----------------------------------------------------------------------------
-- E. Flutter compatibility — existing owner memberships still look valid
-- -----------------------------------------------------------------------------

SELECT
  COUNT(*) AS personal_orgs,
  COUNT(*) FILTER (
    WHERE public.is_personal_org(id)
  ) AS personal_orgs_via_helper
FROM public.organizations
WHERE organization_type = 'personal';

-- Roles still containing classic owner (should remain valid conceptually)
SELECT
  COUNT(*) AS owner_memberships
FROM public.organization_members
WHERE public.normalize_platform_role(role) = 'owner'
   OR role = 'owner';

-- Builder member view empty pre-Batch 2 (OK)
SELECT COUNT(*) AS builder_member_rows FROM public.v_builder_members;

-- -----------------------------------------------------------------------------
-- F. Consolidated pass summary
-- -----------------------------------------------------------------------------

WITH checks AS (
  SELECT
    (SELECT COUNT(*) = 6 FROM public.platform_role_catalog) AS roles_seeded,
    (SELECT public.normalize_platform_role('owner') = 'owner') AS owner_preserved,
    (SELECT public.normalize_platform_role('builder-org-owner') = 'builder_owner') AS alias_ok,
    (SELECT to_regclass('public.platform_operators') IS NOT NULL) AS operators_table_ok,
    (SELECT COUNT(*) = 3
     FROM information_schema.views
     WHERE table_schema = 'public'
       AND table_name IN ('v_platform_users', 'v_builder_members', 'v_super_admin_users')
    ) AS views_ok,
    (SELECT COUNT(*) FILTER (WHERE c.relrowsecurity)
     FROM pg_class c
     JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relname IN ('platform_role_catalog', 'platform_operators')
    ) = 2 AS rls_enabled_ok,
    (SELECT COUNT(*) >= 4
     FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename IN ('platform_role_catalog', 'platform_operators')
    ) AS policies_ok,
    (SELECT COUNT(*) = 0
     FROM pg_policies
     WHERE schemaname = 'public'
       AND policyname LIKE 'platform_%'
       AND tablename NOT IN ('platform_role_catalog', 'platform_operators')
    ) AS no_leak_policies_ok
)
SELECT
  *,
  (
    roles_seeded
    AND owner_preserved
    AND alias_ok
    AND operators_table_ok
    AND views_ok
    AND rls_enabled_ok
    AND policies_ok
    AND no_leak_policies_ok
  ) AS batch_p6b_passed
FROM checks;
