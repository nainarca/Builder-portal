SELECT to_regclass('public.announcement_campaigns') AS announcement_campaigns_table;
SELECT to_regclass('public.announcement_deliveries') AS announcement_deliveries_table;
SELECT to_regclass('public.announcement_audit_events') AS announcement_audit_events_table;
SELECT to_regclass('public.enforce_announcement_campaign_builder_scope') AS announcement_scope_function;
SELECT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'trg_announcement_campaigns_scope'
) AS announcement_scope_trigger_exists;
