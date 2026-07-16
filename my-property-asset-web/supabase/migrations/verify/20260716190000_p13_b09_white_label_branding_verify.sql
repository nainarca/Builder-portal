SELECT to_regclass('public.organization_branding') AS organization_branding_table;
SELECT to_regclass('public.enforce_builder_branding_scope') AS organization_branding_trigger_function;
SELECT EXISTS (
  SELECT 1
  FROM pg_trigger
  WHERE tgname = 'trg_organization_branding_scope'
) AS organization_branding_trigger_exists;
