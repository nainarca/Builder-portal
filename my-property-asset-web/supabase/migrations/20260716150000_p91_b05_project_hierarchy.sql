-- =============================================================================
-- P9.1 / Batch 5 — Project Hierarchy Enhancement (additive)
-- =============================================================================
-- Depends on: P8 Batch 3, P9 Batch 4
-- ENHANCE only — does not redesign buildings; Units remain out of scope.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Expand project_type + add project_hierarchy
-- -----------------------------------------------------------------------------

ALTER TABLE public.builder_projects
  DROP CONSTRAINT IF EXISTS builder_projects_project_type_check;

ALTER TABLE public.builder_projects
  ADD CONSTRAINT builder_projects_project_type_check
  CHECK (
    project_type IN (
      'apartment',
      'villa',
      'residential_plot',
      'commercial',
      'mixed_development',
      'farm_land'
    )
  );

ALTER TABLE public.builder_projects
  ADD COLUMN IF NOT EXISTS project_hierarchy text;

UPDATE public.builder_projects
SET project_hierarchy = CASE
  WHEN project_type IN ('villa', 'residential_plot', 'farm_land') THEN 'direct_units'
  ELSE 'building_based'
END
WHERE project_hierarchy IS NULL;

ALTER TABLE public.builder_projects
  ALTER COLUMN project_hierarchy SET DEFAULT 'building_based';

ALTER TABLE public.builder_projects
  ALTER COLUMN project_hierarchy SET NOT NULL;

ALTER TABLE public.builder_projects
  DROP CONSTRAINT IF EXISTS builder_projects_project_hierarchy_check;

ALTER TABLE public.builder_projects
  ADD CONSTRAINT builder_projects_project_hierarchy_check
  CHECK (project_hierarchy IN ('building_based', 'direct_units'));

CREATE INDEX IF NOT EXISTS idx_builder_projects_org_hierarchy
  ON public.builder_projects (organization_id, project_hierarchy);

COMMENT ON COLUMN public.builder_projects.project_hierarchy IS
  'P9.1 — BUILDING_BASED (Project→Building→Unit) or DIRECT_UNITS (Project→Unit).';

-- -----------------------------------------------------------------------------
-- 2. Enforce type ↔ hierarchy compatibility
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_builder_project_hierarchy()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.project_type IN ('apartment', 'commercial')
     AND NEW.project_hierarchy <> 'building_based' THEN
    RAISE EXCEPTION
      'Apartment and Commercial Tower projects require BUILDING_BASED hierarchy';
  END IF;

  IF NEW.project_type IN ('villa', 'residential_plot', 'farm_land')
     AND NEW.project_hierarchy <> 'direct_units' THEN
    RAISE EXCEPTION
      'Villa Community, Residential Plot Layout, and Farm Land Layout require DIRECT_UNITS hierarchy';
  END IF;

  -- mixed_development may be building_based or direct_units
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_builder_projects_hierarchy ON public.builder_projects;
CREATE TRIGGER trg_builder_projects_hierarchy
  BEFORE INSERT OR UPDATE OF project_type, project_hierarchy
  ON public.builder_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_project_hierarchy();

-- -----------------------------------------------------------------------------
-- 3. Recreate project create/update RPCs with hierarchy param
-- -----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.create_builder_project(
  uuid, text, text, text, text, text, date, date, text, text, text, text, numeric, numeric, text, text
);

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
  p_logo_url text DEFAULT NULL,
  p_project_hierarchy text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_row public.builder_projects%ROWTYPE;
  v_hierarchy text;
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

  v_hierarchy := COALESCE(
    NULLIF(trim(COALESCE(p_project_hierarchy, '')), ''),
    CASE
      WHEN p_project_type IN ('villa', 'residential_plot', 'farm_land') THEN 'direct_units'
      ELSE 'building_based'
    END
  );

  INSERT INTO public.builder_projects (
    organization_id,
    name,
    code,
    project_type,
    project_hierarchy,
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
    v_hierarchy,
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

DROP FUNCTION IF EXISTS public.update_builder_project(
  uuid, text, text, text, text, text, date, date, text, text, text, text, numeric, numeric, text, text
);

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
  p_logo_url text DEFAULT NULL,
  p_project_hierarchy text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_projects%ROWTYPE;
  v_next_hierarchy text;
  v_active_buildings integer;
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

  v_next_hierarchy := COALESCE(p_project_hierarchy, v_row.project_hierarchy);

  IF v_next_hierarchy = 'direct_units' AND v_row.project_hierarchy = 'building_based' THEN
    SELECT count(*)::integer INTO v_active_buildings
    FROM public.builder_buildings
    WHERE project_id = p_project_id
      AND archived_at IS NULL;

    IF v_active_buildings > 0 THEN
      RAISE EXCEPTION
        'Cannot switch to DIRECT_UNITS while active buildings exist';
    END IF;
  END IF;

  UPDATE public.builder_projects
  SET
    name = COALESCE(NULLIF(trim(COALESCE(p_name, '')), ''), name),
    code = COALESCE(NULLIF(upper(trim(COALESCE(p_code, ''))), ''), code),
    project_type = COALESCE(p_project_type, project_type),
    project_hierarchy = v_next_hierarchy,
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

GRANT EXECUTE ON FUNCTION public.create_builder_project TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_builder_project TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. Block building create when hierarchy = direct_units (Building module unchanged otherwise)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_builder_building(
  p_project_id uuid,
  p_name text,
  p_code text,
  p_tower_name text DEFAULT NULL,
  p_block_name text DEFAULT NULL,
  p_display_order integer DEFAULT 0,
  p_floors_count integer DEFAULT 0,
  p_units_count integer DEFAULT 0,
  p_status text DEFAULT 'planning',
  p_description text DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_address_line text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
  v_hierarchy text;
  v_id uuid;
  v_row public.builder_buildings%ROWTYPE;
BEGIN
  SELECT organization_id, project_hierarchy
  INTO v_org, v_hierarchy
  FROM public.builder_projects
  WHERE id = p_project_id;

  IF v_org IS NULL THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  IF v_hierarchy = 'direct_units' THEN
    RAISE EXCEPTION 'Buildings are not allowed for DIRECT_UNITS projects';
  END IF;

  IF NOT (public.is_super_admin() OR public.is_builder_admin(v_org)) THEN
    RAISE EXCEPTION 'Not authorized to create buildings';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'name is required';
  END IF;
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RAISE EXCEPTION 'code is required';
  END IF;

  INSERT INTO public.builder_buildings (
    project_id, organization_id, name, code, tower_name, block_name,
    display_order, floors_count, units_count, status, description, image_url, address_line, created_by
  ) VALUES (
    p_project_id,
    v_org,
    trim(p_name),
    upper(trim(p_code)),
    NULLIF(trim(COALESCE(p_tower_name, '')), ''),
    NULLIF(trim(COALESCE(p_block_name, '')), ''),
    COALESCE(p_display_order, 0),
    GREATEST(COALESCE(p_floors_count, 0), 0),
    GREATEST(COALESCE(p_units_count, 0), 0),
    COALESCE(NULLIF(trim(COALESCE(p_status, '')), ''), 'planning'),
    NULLIF(trim(COALESCE(p_description, '')), ''),
    NULLIF(trim(COALESCE(p_image_url, '')), ''),
    NULLIF(trim(COALESCE(p_address_line, '')), ''),
    auth.uid()
  )
  RETURNING id INTO v_id;

  SELECT * INTO v_row FROM public.builder_buildings WHERE id = v_id;
  RETURN to_jsonb(v_row);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Building code already exists for this project';
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_builder_building TO authenticated;

COMMIT;
