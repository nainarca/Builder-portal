-- =============================================================================
-- P14 / Batch 11 — Builder Communication Hub
-- =============================================================================
-- Reference: P5 Batch 11, P14 Builder Communication Hub V1
-- Depends on: P6A, P7, P8–P12
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.announcement_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  project_id uuid,
  building_id uuid,
  communication_type text NOT NULL,
  title text NOT NULL,
  short_description text,
  detailed_content text,
  banner_image_url text,
  attachment_url text,
  cta_label text,
  cta_external_url text,
  cta_internal_route text,
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  audience_type text NOT NULL
    CHECK (
      audience_type IN (
        'all_owners',
        'by_project',
        'by_building',
        'by_unit',
        'selected_owners',
        'by_property_type'
      )
    ),
  audience_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'published', 'expired', 'archived', 'cancelled')),
  publish_at timestamptz,
  start_at timestamptz,
  expires_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  delivery_status text NOT NULL DEFAULT 'prepared'
    CHECK (delivery_status IN ('prepared', 'queued', 'delivered', 'failed')),
  moderated boolean NOT NULL DEFAULT false,
  disabled_by_platform boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  archived_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid REFERENCES auth.users (id),
  updated_by uuid REFERENCES auth.users (id),
  published_by uuid REFERENCES auth.users (id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_campaigns_org_status
  ON public.announcement_campaigns (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_announcement_campaigns_publish_at
  ON public.announcement_campaigns (publish_at)
  WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_announcement_campaigns_type
  ON public.announcement_campaigns (communication_type);

COMMENT ON TABLE public.announcement_campaigns IS
  'P14 Batch 11 — Builder communication campaigns for owner delivery.';

CREATE TABLE IF NOT EXISTS public.announcement_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.announcement_campaigns (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  owner_user_id uuid REFERENCES auth.users (id),
  assignment_id uuid,
  unit_id uuid,
  project_id uuid,
  delivery_channel text NOT NULL DEFAULT 'in_app'
    CHECK (delivery_channel IN ('in_app', 'push')),
  delivery_status text NOT NULL DEFAULT 'prepared'
    CHECK (delivery_status IN ('prepared', 'queued', 'delivered', 'failed', 'read')),
  read_at timestamptz,
  bookmarked boolean NOT NULL DEFAULT false,
  archived_by_owner boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_announcement_deliveries_campaign_owner
  ON public.announcement_deliveries (campaign_id, owner_id);

CREATE INDEX IF NOT EXISTS idx_announcement_deliveries_owner
  ON public.announcement_deliveries (owner_id, delivery_status);

COMMENT ON TABLE public.announcement_deliveries IS
  'P14 Batch 11 — Per-owner communication delivery records for Flutter notification center.';

CREATE TABLE IF NOT EXISTS public.announcement_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.announcement_campaigns (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  action text NOT NULL
    CHECK (action IN ('created', 'updated', 'published', 'scheduled', 'archived', 'cancelled', 'deleted', 'moderated', 'disabled')),
  actor_user_id uuid REFERENCES auth.users (id),
  actor_label text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcement_audit_campaign
  ON public.announcement_audit_events (campaign_id, created_at DESC);

COMMENT ON TABLE public.announcement_audit_events IS
  'P14 Batch 11 — Immutable audit trail for builder communications.';

CREATE OR REPLACE FUNCTION public.enforce_announcement_campaign_builder_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_builder_org(NEW.organization_id) THEN
    RAISE EXCEPTION 'announcement_campaigns.organization_id must reference a builder organization';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_announcement_campaigns_scope ON public.announcement_campaigns;
CREATE TRIGGER trg_announcement_campaigns_scope
  BEFORE INSERT OR UPDATE
  ON public.announcement_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_announcement_campaign_builder_scope();

COMMIT;
