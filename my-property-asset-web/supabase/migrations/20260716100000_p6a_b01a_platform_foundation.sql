-- =============================================================================
-- P6A / Batch 1A — Platform Foundation (organizations discrimination only)
-- =============================================================================
-- Reference: P4, P5 Batch 1 (subset 1A)
-- Branch:    feature/platform-database
--
-- IN SCOPE
--   1. organizations.organization_type  (additive)
--   2. organizations.status             (additive)
--   3. Backfill organization_type = 'personal' for existing rows
--   4. Helper views:  v_personal_organizations, v_builder_organizations
--   5. Helper functions: is_personal_org(uuid), is_builder_org(uuid)
--
-- OUT OF SCOPE (do NOT add in this file)
--   platform_operators, platform roles, RLS policy changes,
--   builder_companies, projects, buildings, units, invitations,
--   documents, branding, subscriptions, announcements,
--   user_profiles changes, properties / loans / expenses / tenants
--
-- Compatibility: Flutter Personal Workspaces continue unchanged.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Additive columns on organizations
-- -----------------------------------------------------------------------------

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS organization_type text;

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS status text;

-- Defaults for future inserts (safe for Flutter clients that omit these columns)
ALTER TABLE public.organizations
  ALTER COLUMN organization_type SET DEFAULT 'personal';

ALTER TABLE public.organizations
  ALTER COLUMN status SET DEFAULT 'active';

-- -----------------------------------------------------------------------------
-- 2. Backfill existing rows (Personal Workspace)
-- -----------------------------------------------------------------------------

UPDATE public.organizations
SET organization_type = 'personal'
WHERE organization_type IS NULL;

UPDATE public.organizations
SET status = 'active'
WHERE status IS NULL;

-- Enforce allowed values going forward (additive CHECK; existing backfill satisfies)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'organizations_organization_type_check'
      AND conrelid = 'public.organizations'::regclass
  ) THEN
    ALTER TABLE public.organizations
      ADD CONSTRAINT organizations_organization_type_check
      CHECK (organization_type IN ('personal', 'builder'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'organizations_status_check'
      AND conrelid = 'public.organizations'::regclass
  ) THEN
    ALTER TABLE public.organizations
      ADD CONSTRAINT organizations_status_check
      CHECK (status IN ('active', 'pending_approval', 'suspended'));
  END IF;
END $$;

-- Optional NOT NULL after backfill (only if all rows populated)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'organizations'
      AND column_name = 'organization_type'
      AND is_nullable = 'YES'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.organizations WHERE organization_type IS NULL
    ) THEN
      ALTER TABLE public.organizations
        ALTER COLUMN organization_type SET NOT NULL;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'organizations'
      AND column_name = 'status'
      AND is_nullable = 'YES'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.organizations WHERE status IS NULL
    ) THEN
      ALTER TABLE public.organizations
        ALTER COLUMN status SET NOT NULL;
    END IF;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_organizations_organization_type
  ON public.organizations (organization_type);

CREATE INDEX IF NOT EXISTS idx_organizations_status
  ON public.organizations (status);

-- -----------------------------------------------------------------------------
-- 3. Helper views
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_personal_organizations AS
SELECT *
FROM public.organizations
WHERE organization_type = 'personal';

COMMENT ON VIEW public.v_personal_organizations IS
  'P6A Batch 1A — Personal Workspace organizations (Flutter Owner App).';

CREATE OR REPLACE VIEW public.v_builder_organizations AS
SELECT *
FROM public.organizations
WHERE organization_type = 'builder';

COMMENT ON VIEW public.v_builder_organizations IS
  'P6A Batch 1A — Builder Organizations (Angular Builder Portal). Empty until Batch 2+ creates builder orgs.';

-- -----------------------------------------------------------------------------
-- 4. Helper functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_personal_org(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organizations o
    WHERE o.id = p_organization_id
      AND o.organization_type = 'personal'
  );
$$;

COMMENT ON FUNCTION public.is_personal_org(uuid) IS
  'P6A Batch 1A — Returns true when the organization is a Personal Workspace.';

CREATE OR REPLACE FUNCTION public.is_builder_org(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organizations o
    WHERE o.id = p_organization_id
      AND o.organization_type = 'builder'
  );
$$;

COMMENT ON FUNCTION public.is_builder_org(uuid) IS
  'P6A Batch 1A — Returns true when the organization is a Builder Organization.';

COMMIT;
