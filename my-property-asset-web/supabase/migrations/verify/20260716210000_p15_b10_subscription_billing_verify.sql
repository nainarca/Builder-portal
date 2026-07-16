SELECT to_regclass('public.subscription_plans') AS subscription_plans_table;
SELECT to_regclass('public.organization_subscriptions') AS organization_subscriptions_table;
SELECT to_regclass('public.subscription_invoices') AS subscription_invoices_table;
SELECT to_regclass('public.subscription_payments') AS subscription_payments_table;
SELECT to_regclass('public.enforce_builder_subscription_scope') AS subscription_scope_function;
SELECT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'trg_organization_subscriptions_scope'
) AS subscription_scope_trigger_exists;
SELECT COUNT(*) AS seeded_plan_count FROM public.subscription_plans;
