SELECT to_regclass('public.audit_logs') AS audit_logs_table;
SELECT to_regclass('public.builder_activity_logs') AS builder_activity_logs_table;
SELECT to_regclass('public.support_access_grants') AS support_access_grants_table;
SELECT to_regclass('public.support_tickets') AS support_tickets_table;
SELECT to_regclass('public.platform_settings') AS platform_settings_table;
SELECT to_regclass('public.platform_feature_flags') AS platform_feature_flags_table;
SELECT to_regclass('public.global_announcements') AS global_announcements_table;
SELECT to_regclass('public.write_audit_event') AS write_audit_event_function;
SELECT COUNT(*) AS seeded_flags FROM public.platform_feature_flags;
