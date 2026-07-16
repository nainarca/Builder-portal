-- =============================================================================
-- P16 / Batch 12 — Super Admin Platform Management
-- =============================================================================
-- Audit logs, support tickets, platform settings, feature flags, announcements
-- Reuses organizations / builders / subscriptions — no builder data duplication
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  actor_label text,
  category text NOT NULL
    CHECK (
      category IN (
        'builder_login',
        'subscription',
        'branding',
        'project',
        'handover',
        'permission',
        'system',
        'communication',
        'support',
        'settings'
      )
    ),
  action text NOT NULL,
  entity_type text,
  entity_id text,
  summary text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created
  ON public.audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created
  ON public.audit_logs (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_category
  ON public.audit_logs (category, created_at DESC);

COMMENT ON TABLE public.audit_logs IS
  'P16 Batch 12 — Immutable platform-wide audit trail (insert-only for normal roles).';

CREATE TABLE IF NOT EXISTS public.builder_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  summary text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_builder_activity_logs_org
  ON public.builder_activity_logs (organization_id, created_at DESC);

COMMENT ON TABLE public.builder_activity_logs IS
  'P16 Batch 12 — Builder-scoped activity for Super Admin and builder self-service.';

CREATE TABLE IF NOT EXISTS public.support_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  granted_to_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  granted_by_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  reason text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_access_grants_org
  ON public.support_access_grants (organization_id)
  WHERE revoked_at IS NULL;

COMMENT ON TABLE public.support_access_grants IS
  'P16 Batch 12 — Time-boxed Super Admin / support access into builder tenants.';

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE SET NULL,
  builder_company_name text,
  subject text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'waiting_builder', 'resolved', 'closed')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  contact_email text,
  assigned_to text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status
  ON public.support_tickets (status, updated_at DESC);

COMMENT ON TABLE public.support_tickets IS
  'P16 Batch 12 — Builder support queue for Super Admin Support Center.';

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key text NOT NULL UNIQUE,
  settings_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id)
);

COMMENT ON TABLE public.platform_settings IS
  'P16 Batch 12 — Platform name, support contacts, legal URLs, maintenance mode.';

CREATE TABLE IF NOT EXISTS public.platform_feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'all',
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.platform_feature_flags IS
  'P16 Batch 12 — Feature flag catalog for Super Admin platform settings.';

CREATE TABLE IF NOT EXISTS public.global_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL DEFAULT 'info'
    CHECK (severity IN ('info', 'warning', 'critical')),
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_global_announcements_active
  ON public.global_announcements (active, starts_at);

COMMENT ON TABLE public.global_announcements IS
  'P16 Batch 12 — Platform-wide announcements managed by Super Admin.';

CREATE OR REPLACE FUNCTION public.write_audit_event(
  p_organization_id uuid,
  p_actor_user_id uuid,
  p_actor_label text,
  p_category text,
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_summary text,
  p_detail jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    organization_id, actor_user_id, actor_label, category, action,
    entity_type, entity_id, summary, detail
  )
  VALUES (
    p_organization_id, p_actor_user_id, p_actor_label, p_category, p_action,
    p_entity_type, p_entity_id, p_summary, COALESCE(p_detail, '{}'::jsonb)
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.write_audit_event IS
  'P16 Batch 12 — Helper to append immutable audit events.';

-- Seed default platform settings + flags (idempotent)
INSERT INTO public.platform_settings (settings_key, settings_value)
VALUES
  (
    'general',
    jsonb_build_object(
      'platformName', 'MyPropertyAsset',
      'supportEmail', 'support@mypropertyasset.com',
      'supportPhone', '+91-80-4000-1000',
      'termsUrl', '/legal/terms',
      'privacyUrl', '/legal/privacy',
      'maintenanceMode', false,
      'maintenanceMessage', 'Scheduled maintenance is in progress.'
    )
  )
ON CONFLICT (settings_key) DO NOTHING;

INSERT INTO public.platform_feature_flags (flag_key, label, description, enabled, environment)
VALUES
  ('advanced-analytics', 'Advanced analytics', 'Enable advanced Super Admin analytics charts', true, 'all'),
  ('support-center', 'Support Center', 'Enable builder support ticket queue', true, 'all'),
  ('maintenance-banner', 'Maintenance banner', 'Show maintenance banner when mode is on', true, 'all')
ON CONFLICT (flag_key) DO NOTHING;

COMMIT;
