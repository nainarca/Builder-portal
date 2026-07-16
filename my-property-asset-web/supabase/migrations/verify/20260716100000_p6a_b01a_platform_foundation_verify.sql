-- =============================================================================
-- P6A / Batch 1A — Verification SQL
-- Run AFTER applying 20260716100000_p6a_b01a_platform_foundation.sql
-- Expect: all checks return ok / zero failures
-- =============================================================================

-- 1) Columns exist
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'organizations'
  AND column_name IN ('organization_type', 'status')
ORDER BY column_name;

-- 2) No NULL organization_type or status after backfill
SELECT
  COUNT(*) FILTER (WHERE organization_type IS NULL) AS null_organization_type_count,
  COUNT(*) FILTER (WHERE status IS NULL) AS null_status_count,
  COUNT(*) AS total_organizations
FROM public.organizations;

-- Expected: null_organization_type_count = 0, null_status_count = 0

-- 3) All existing rows are personal (until Batch 2 creates builders)
SELECT
  organization_type,
  COUNT(*) AS cnt
FROM public.organizations
GROUP BY organization_type
ORDER BY organization_type;

-- Expected before Batch 2: only 'personal'

-- 4) CHECK constraints present
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.organizations'::regclass
  AND conname IN (
    'organizations_organization_type_check',
    'organizations_status_check'
  );

-- 5) Indexes present
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'organizations'
  AND indexname IN (
    'idx_organizations_organization_type',
    'idx_organizations_status'
  );

-- 6) Views present and queryable
SELECT COUNT(*) AS personal_org_view_count
FROM public.v_personal_organizations;

SELECT COUNT(*) AS builder_org_view_count
FROM public.v_builder_organizations;

-- Expected: personal_org_view_count = total personal orgs; builder_org_view_count = 0 (pre-Batch 2)

-- 7) Helper functions
SELECT
  public.is_personal_org(id) AS is_personal,
  public.is_builder_org(id) AS is_builder
FROM public.organizations
LIMIT 5;

-- Expected for existing rows: is_personal = true, is_builder = false

-- 8) Flutter-critical tables untouched (structure smoke — no data mutation)
SELECT
  c.relname AS table_name,
  COUNT(a.attname) AS column_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('properties', 'loans', 'expenses', 'tenants', 'financial_history')
GROUP BY c.relname
ORDER BY c.relname;

-- 9) Consolidated pass/fail summary
WITH checks AS (
  SELECT
    (SELECT COUNT(*) = 2
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'organizations'
       AND column_name IN ('organization_type', 'status')) AS columns_ok,
    (SELECT COUNT(*) = 0 FROM public.organizations WHERE organization_type IS NULL OR status IS NULL)
      AS backfill_ok,
    (SELECT COUNT(*) = 0 FROM public.organizations WHERE organization_type IS DISTINCT FROM 'personal')
      AS all_personal_ok_pre_batch2,
    (SELECT COUNT(*) = 2
     FROM pg_constraint
     WHERE conrelid = 'public.organizations'::regclass
       AND conname IN (
         'organizations_organization_type_check',
         'organizations_status_check'
       )) AS checks_ok,
    (SELECT COUNT(*) = 2
     FROM pg_indexes
     WHERE schemaname = 'public'
       AND tablename = 'organizations'
       AND indexname IN (
         'idx_organizations_organization_type',
         'idx_organizations_status'
       )) AS indexes_ok,
    (SELECT COUNT(*) = 2
     FROM information_schema.views
     WHERE table_schema = 'public'
       AND table_name IN ('v_personal_organizations', 'v_builder_organizations')) AS views_ok,
    (SELECT COUNT(*) = 2
     FROM pg_proc p
     JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public'
       AND p.proname IN ('is_personal_org', 'is_builder_org')) AS functions_ok
)
SELECT
  columns_ok,
  backfill_ok,
  all_personal_ok_pre_batch2,
  checks_ok,
  indexes_ok,
  views_ok,
  functions_ok,
  (
    columns_ok
    AND backfill_ok
    AND all_personal_ok_pre_batch2
    AND checks_ok
    AND indexes_ok
    AND views_ok
    AND functions_ok
  ) AS batch_1a_passed
FROM checks;
