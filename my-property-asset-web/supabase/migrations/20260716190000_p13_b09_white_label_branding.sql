-- =============================================================================
-- P13 / Batch 9 — White Label Branding
-- =============================================================================
-- Reference: P5 Batch 9, P13 White Label Branding
-- Depends on: P6A, P7
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.organization_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.organizations (id) ON DELETE CASCADE,
  company_name text NOT NULL,
  display_name text NOT NULL,
  short_name text NOT NULL,
  application_name text NOT NULL,
  tagline text,
  logo_url text,
  dark_logo_url text,
  favicon_url text,
  login_background_url text,
  dashboard_banner_url text,
  mobile_splash_image_url text,
  primary_color text NOT NULL DEFAULT '#1B4D89',
  secondary_color text NOT NULL DEFAULT '#475569',
  accent_color text NOT NULL DEFAULT '#0EA5E9',
  support_email text,
  support_phone text,
  website_url text,
  office_address text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  copyright_text text,
  terms_url text,
  privacy_policy_url text,
  theme_settings jsonb NOT NULL DEFAULT jsonb_build_object(
    'lightTheme', 'light',
    'darkTheme', 'dark',
    'buttonStyle', 'rounded',
    'navigationStyle', 'solid',
    'cardStyle', 'soft',
    'dashboardTheme', 'default',
    'typography', 'inter'
  ),
  branding_status text NOT NULL DEFAULT 'draft'
    CHECK (branding_status IN ('draft', 'active', 'disabled')),
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  updated_by uuid REFERENCES auth.users (id)
);

CREATE INDEX IF NOT EXISTS idx_organization_branding_status
  ON public.organization_branding (branding_status);

COMMENT ON TABLE public.organization_branding IS
  'P13 Batch 9 — White-label branding profile for builder organizations.';

CREATE OR REPLACE FUNCTION public.enforce_builder_branding_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_builder_org(NEW.organization_id) THEN
    RAISE EXCEPTION 'organization_branding.organization_id must reference a builder organization';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_organization_branding_scope ON public.organization_branding;
CREATE TRIGGER trg_organization_branding_scope
  BEFORE INSERT OR UPDATE
  ON public.organization_branding
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_branding_scope();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage'
      AND c.relname = 'buckets'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('organization-branding', 'organization-branding', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

COMMIT;
