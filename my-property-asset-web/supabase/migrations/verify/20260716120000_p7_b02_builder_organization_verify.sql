-- P7 Batch 2 verification
SELECT to_regclass('public.builder_companies') AS builder_companies;
SELECT to_regclass('public.builder_staff_invitations') AS builder_staff_invitations;

SELECT proname
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND proname IN (
    'create_builder_organization',
    'accept_builder_invitation',
    'resend_builder_invitation'
  )
ORDER BY proname;

SELECT c.relname, c.relrowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('builder_companies', 'builder_staff_invitations');

SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('builder_companies', 'builder_staff_invitations')
ORDER BY tablename, policyname;

-- Ensure Flutter tables untouched by this batch naming
SELECT COUNT(*) AS flutter_tables_present
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('properties', 'loans', 'expenses', 'tenants');
