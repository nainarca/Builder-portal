-- =============================================================================
-- P8 / Batch 3 — Builder Project Management Vertical Slice
-- =============================================================================
-- Depends on: P6A, P6B, P7 (Batch 2)
-- OUT OF SCOPE: buildings, units, owners, documents
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. builder_projects
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.builder_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  project_type text NOT NULL
    CHECK (
      project_type IN (
        'apartment',
        'villa',
        'residential_plot',
        'commercial',
        'mixed_development'
      )
    ),
  status text NOT NULL DEFAULT 'planning'
    CHECK (
      status IN (
        'upcoming',
        'planning',
        'construction',
        'completed',
        'archived'
      )
    ),
  description text,
  launch_date date,
  expected_completion_date date,
  address_line text,
  city text,
  state text,
  pincode text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  banner_url text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  archived_at timestamptz,
  CONSTRAINT builder_projects_code_org_unique UNIQUE (organization_id, code)
);

CREATE OR REPLACE FUNCTION public.enforce_builder_project_org_type()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_builder_org(NEW.organization_id) THEN
    RAISE EXCEPTION 'builder_projects.organization_id must reference a builder organization';
  END IF;
  NEW.updated_at := now();
  IF NEW.status = 'archived' AND NEW.archived_at IS NULL THEN
    NEW.archived_at := now();
  END IF;
  IF NEW.status <> 'archived' THEN
    NEW.archived_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_builder_projects_org_type ON public.builder_projects;
CREATE TRIGGER trg_builder_projects_org_type
  BEFORE INSERT OR UPDATE
  ON public.builder_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_project_org_type();

CREATE INDEX IF NOT EXISTS idx_builder_projects_org_status
  ON public.builder_projects (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_builder_projects_org_name
  ON public.builder_projects (organization_id, name);

CREATE INDEX IF NOT EXISTS idx_builder_projects_org_type
  ON public.builder_projects (organization_id, project_type);

CREATE INDEX IF NOT EXISTS idx_builder_projects_org_code
  ON public.builder_projects (organization_id, lower(code));

COMMENT ON TABLE public.builder_projects IS
  'P8 Batch 3 — Builder development projects (no buildings/units in this batch).';

-- -----------------------------------------------------------------------------
-- 2. RPCs — CRUD + archive (API contracts for Angular repository)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.list_builder_projects(
  p_organization_id uuid DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_project_type text DEFAULT NULL,
  p_include_archived boolean DEFAULT false,
  p_sort_field text DEFAULT 'name',
  p_sort_direction text DEFAULT 'asc',
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
  v_offset integer;
  v_total integer;
  v_items jsonb;
BEGIN
  v_org := COALESCE(p_organization_id, public.get_current_builder());

  IF v_org IS NULL THEN
    RAISE EXCEPTION 'Builder organization context required';
  END IF;

  IF NOT public.can_access_builder_org(v_org) THEN
    RAISE EXCEPTION 'Not authorized for this builder organization';
  END IF;

  v_offset := GREATEST((GREATEST(p_page, 1) - 1) * GREATEST(p_page_size, 1), 0);

  SELECT count(*)::integer INTO v_total
  FROM public.builder_projects bp
  WHERE bp.organization_id = v_org
    AND (p_include_archived OR bp.status <> 'archived')
    AND (
      p_search IS NULL
      OR length(trim(p_search)) = 0
      OR bp.name ILIKE '%' || trim(p_search) || '%'
      OR bp.code ILIKE '%' || trim(p_search) || '%'
      OR COALESCE(bp.city, '') ILIKE '%' || trim(p_search) || '%'
    )
    AND (p_status IS NULL OR bp.status = p_status)
    AND (p_project_type IS NULL OR bp.project_type = p_project_type);

  SELECT COALESCE(jsonb_agg(row_to_json(q)::jsonb), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT
      bp.id,
      bp.organization_id,
      bp.name,
      bp.code,
      bp.project_type,
      bp.status,
      bp.description,
      bp.launch_date,
      bp.expected_completion_date,
      bp.address_line,
      bp.city,
      bp.state,
      bp.pincode,
      bp.latitude,
      bp.longitude,
      bp.banner_url,
      bp.logo_url,
      bp.created_at,
      bp.updated_at,
      bp.archived_at
    FROM public.builder_projects bp
    WHERE bp.organization_id = v_org
      AND (p_include_archived OR bp.status <> 'archived')
      AND (
        p_search IS NULL
        OR length(trim(p_search)) = 0
        OR bp.name ILIKE '%' || trim(p_search) || '%'
        OR bp.code ILIKE '%' || trim(p_search) || '%'
        OR COALESCE(bp.city, '') ILIKE '%' || trim(p_search) || '%'
      )
      AND (p_status IS NULL OR bp.status = p_status)
      AND (p_project_type IS NULL OR bp.project_type = p_project_type)
    ORDER BY
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'name' THEN bp.name END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'code' THEN bp.code END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'status' THEN bp.status END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) IN ('expected_completion_date', 'expectedcompletiondate')
             THEN bp.expected_completion_date::text END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'created_at' THEN bp.created_at::text END ASC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'name' THEN bp.name END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'code' THEN bp.code END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'status' THEN bp.status END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) IN ('expected_completion_date', 'expectedcompletiondate')
             THEN bp.expected_completion_date::text END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'name')) = 'created_at' THEN bp.created_at::text END DESC,
      bp.name ASC
    LIMIT GREATEST(p_page_size, 1)
    OFFSET v_offset
  ) q;

  RETURN jsonb_build_object(
    'items', v_items,
    'total', v_total,
    'page', GREATEST(p_page, 1),
    'page_size', GREATEST(p_page_size, 1)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_builder_project(p_project_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_projects%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_projects WHERE id = p_project_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  IF NOT public.can_access_builder_org(v_row.organization_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN to_jsonb(v_row);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_builder_project(
  p_organization_id uuid,
  p_name text,
  p_code text,
  p_project_type text,
  p_status text DEFAULT 'planning',
  p_description text DEFAULT NULL,
  p_launch_date date DEFAULT NULL,
  p_expected_completion_date date DEFAULT NULL,
  p_address_line text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_pincode text DEFAULT NULL,
  p_latitude numeric DEFAULT NULL,
  p_longitude numeric DEFAULT NULL,
  p_banner_url text DEFAULT NULL,
  p_logo_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_row public.builder_projects%ROWTYPE;
BEGIN
  IF NOT (
    public.is_super_admin()
    OR public.is_builder_admin(p_organization_id)
  ) THEN
    RAISE EXCEPTION 'Not authorized to create projects';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'name is required';
  END IF;

  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RAISE EXCEPTION 'code is required';
  END IF;

  INSERT INTO public.builder_projects (
    organization_id,
    name,
    code,
    project_type,
    status,
    description,
    launch_date,
    expected_completion_date,
    address_line,
    city,
    state,
    pincode,
    latitude,
    longitude,
    banner_url,
    logo_url,
    created_by
  ) VALUES (
    p_organization_id,
    trim(p_name),
    upper(trim(p_code)),
    p_project_type,
    COALESCE(NULLIF(trim(COALESCE(p_status, '')), ''), 'planning'),
    NULLIF(trim(COALESCE(p_description, '')), ''),
    p_launch_date,
    p_expected_completion_date,
    NULLIF(trim(COALESCE(p_address_line, '')), ''),
    NULLIF(trim(COALESCE(p_city, '')), ''),
    NULLIF(trim(COALESCE(p_state, '')), ''),
    NULLIF(trim(COALESCE(p_pincode, '')), ''),
    p_latitude,
    p_longitude,
    NULLIF(trim(COALESCE(p_banner_url, '')), ''),
    NULLIF(trim(COALESCE(p_logo_url, '')), ''),
    auth.uid()
  )
  RETURNING id INTO v_id;

  SELECT * INTO v_row FROM public.builder_projects WHERE id = v_id;
  RETURN to_jsonb(v_row);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_builder_project(
  p_project_id uuid,
  p_name text DEFAULT NULL,
  p_code text DEFAULT NULL,
  p_project_type text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_launch_date date DEFAULT NULL,
  p_expected_completion_date date DEFAULT NULL,
  p_address_line text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_pincode text DEFAULT NULL,
  p_latitude numeric DEFAULT NULL,
  p_longitude numeric DEFAULT NULL,
  p_banner_url text DEFAULT NULL,
  p_logo_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_projects%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_projects WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  IF NOT (
    public.is_super_admin()
    OR public.is_builder_admin(v_row.organization_id)
  ) THEN
    RAISE EXCEPTION 'Not authorized to update projects';
  END IF;

  UPDATE public.builder_projects
  SET
    name = COALESCE(NULLIF(trim(COALESCE(p_name, '')), ''), name),
    code = COALESCE(NULLIF(upper(trim(COALESCE(p_code, ''))), ''), code),
    project_type = COALESCE(p_project_type, project_type),
    status = COALESCE(p_status, status),
    description = CASE WHEN p_description IS NULL THEN description ELSE NULLIF(trim(p_description), '') END,
    launch_date = COALESCE(p_launch_date, launch_date),
    expected_completion_date = COALESCE(p_expected_completion_date, expected_completion_date),
    address_line = CASE WHEN p_address_line IS NULL THEN address_line ELSE NULLIF(trim(p_address_line), '') END,
    city = CASE WHEN p_city IS NULL THEN city ELSE NULLIF(trim(p_city), '') END,
    state = CASE WHEN p_state IS NULL THEN state ELSE NULLIF(trim(p_state), '') END,
    pincode = CASE WHEN p_pincode IS NULL THEN pincode ELSE NULLIF(trim(p_pincode), '') END,
    latitude = COALESCE(p_latitude, latitude),
    longitude = COALESCE(p_longitude, longitude),
    banner_url = CASE WHEN p_banner_url IS NULL THEN banner_url ELSE NULLIF(trim(p_banner_url), '') END,
    logo_url = CASE WHEN p_logo_url IS NULL THEN logo_url ELSE NULLIF(trim(p_logo_url), '') END
  WHERE id = p_project_id
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_builder_project(p_project_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_projects%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_projects WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  IF NOT (
    public.is_super_admin()
    OR public.is_builder_admin(v_row.organization_id)
  ) THEN
    RAISE EXCEPTION 'Not authorized to archive projects';
  END IF;

  UPDATE public.builder_projects
  SET status = 'archived'
  WHERE id = p_project_id
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.builder_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS builder_projects_select ON public.builder_projects;
CREATE POLICY builder_projects_select
  ON public.builder_projects
  FOR SELECT
  TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_builder_member(organization_id)
  );

DROP POLICY IF EXISTS builder_projects_insert ON public.builder_projects;
CREATE POLICY builder_projects_insert
  ON public.builder_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_super_admin()
    OR public.is_builder_admin(organization_id)
  );

DROP POLICY IF EXISTS builder_projects_update ON public.builder_projects;
CREATE POLICY builder_projects_update
  ON public.builder_projects
  FOR UPDATE
  TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_builder_admin(organization_id)
  )
  WITH CHECK (
    public.is_super_admin()
    OR public.is_builder_admin(organization_id)
  );

GRANT SELECT, INSERT, UPDATE ON public.builder_projects TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_builder_projects TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_builder_project TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_builder_project TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_builder_project TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_builder_project TO authenticated;

COMMIT;
