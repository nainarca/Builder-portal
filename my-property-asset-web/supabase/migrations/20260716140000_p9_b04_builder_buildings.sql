-- =============================================================================
-- P9 / Batch 4 — Building Management Vertical Slice
-- =============================================================================
-- Depends on: P6A, P6B, P7, P8 (Batch 3)
-- OUT OF SCOPE: units, owners, documents
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. builder_buildings
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.builder_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.builder_projects (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  tower_name text,
  block_name text,
  display_order integer NOT NULL DEFAULT 0,
  floors_count integer NOT NULL DEFAULT 0
    CHECK (floors_count >= 0),
  units_count integer NOT NULL DEFAULT 0
    CHECK (units_count >= 0),
  status text NOT NULL DEFAULT 'planning'
    CHECK (
      status IN (
        'planning',
        'construction',
        'completed',
        'archived'
      )
    ),
  description text,
  image_url text,
  address_line text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  archived_at timestamptz,
  CONSTRAINT builder_buildings_code_project_unique UNIQUE (project_id, code)
);

CREATE OR REPLACE FUNCTION public.enforce_builder_building_project_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_org uuid;
BEGIN
  SELECT organization_id INTO v_org
  FROM public.builder_projects
  WHERE id = NEW.project_id;

  IF v_org IS NULL THEN
    RAISE EXCEPTION 'builder_buildings.project_id must reference an existing project';
  END IF;

  -- Buildings cannot move across projects; org always mirrors the project.
  IF TG_OP = 'UPDATE' AND NEW.project_id IS DISTINCT FROM OLD.project_id THEN
    RAISE EXCEPTION 'Buildings cannot be moved to a different project';
  END IF;

  NEW.organization_id := v_org;
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

DROP TRIGGER IF EXISTS trg_builder_buildings_project_scope ON public.builder_buildings;
CREATE TRIGGER trg_builder_buildings_project_scope
  BEFORE INSERT OR UPDATE
  ON public.builder_buildings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_building_project_scope();

CREATE INDEX IF NOT EXISTS idx_builder_buildings_project_status
  ON public.builder_buildings (project_id, status);

CREATE INDEX IF NOT EXISTS idx_builder_buildings_project_name
  ON public.builder_buildings (project_id, name);

CREATE INDEX IF NOT EXISTS idx_builder_buildings_org
  ON public.builder_buildings (organization_id);

CREATE INDEX IF NOT EXISTS idx_builder_buildings_display_order
  ON public.builder_buildings (project_id, display_order);

COMMENT ON TABLE public.builder_buildings IS
  'P9 Batch 4 — Buildings/towers under a builder project (units deferred).';

-- -----------------------------------------------------------------------------
-- 2. RPCs
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.list_builder_buildings(
  p_project_id uuid,
  p_search text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_include_archived boolean DEFAULT false,
  p_sort_field text DEFAULT 'display_order',
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
  SELECT organization_id INTO v_org FROM public.builder_projects WHERE id = p_project_id;
  IF v_org IS NULL THEN
    RAISE EXCEPTION 'Project not found';
  END IF;
  IF NOT public.can_access_builder_org(v_org) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  v_offset := GREATEST((GREATEST(p_page, 1) - 1) * GREATEST(p_page_size, 1), 0);

  SELECT count(*)::integer INTO v_total
  FROM public.builder_buildings b
  WHERE b.project_id = p_project_id
    AND (p_include_archived OR b.status <> 'archived')
    AND (
      p_search IS NULL OR length(trim(p_search)) = 0
      OR b.name ILIKE '%' || trim(p_search) || '%'
      OR b.code ILIKE '%' || trim(p_search) || '%'
      OR COALESCE(b.tower_name, '') ILIKE '%' || trim(p_search) || '%'
      OR COALESCE(b.block_name, '') ILIKE '%' || trim(p_search) || '%'
    )
    AND (p_status IS NULL OR b.status = p_status);

  SELECT COALESCE(jsonb_agg(row_to_json(q)::jsonb), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT
      b.id, b.project_id, b.organization_id, b.name, b.code,
      b.tower_name, b.block_name, b.display_order, b.floors_count, b.units_count,
      b.status, b.description, b.image_url, b.address_line,
      b.created_at, b.updated_at, b.archived_at
    FROM public.builder_buildings b
    WHERE b.project_id = p_project_id
      AND (p_include_archived OR b.status <> 'archived')
      AND (
        p_search IS NULL OR length(trim(p_search)) = 0
        OR b.name ILIKE '%' || trim(p_search) || '%'
        OR b.code ILIKE '%' || trim(p_search) || '%'
        OR COALESCE(b.tower_name, '') ILIKE '%' || trim(p_search) || '%'
        OR COALESCE(b.block_name, '') ILIKE '%' || trim(p_search) || '%'
      )
      AND (p_status IS NULL OR b.status = p_status)
    ORDER BY
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'display_order' THEN b.display_order::text END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'name' THEN b.name END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'code' THEN b.code END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'status' THEN b.status END ASC,
      CASE WHEN lower(p_sort_direction) = 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'created_at' THEN b.created_at::text END ASC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'display_order' THEN b.display_order::text END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'name' THEN b.name END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'code' THEN b.code END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'status' THEN b.status END DESC,
      CASE WHEN lower(p_sort_direction) <> 'desc' THEN NULL
           WHEN lower(COALESCE(p_sort_field, 'display_order')) = 'created_at' THEN b.created_at::text END DESC,
      b.display_order ASC, b.name ASC
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

CREATE OR REPLACE FUNCTION public.get_builder_building(p_building_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_buildings%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_buildings WHERE id = p_building_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  IF NOT public.can_access_builder_org(v_row.organization_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN to_jsonb(v_row);
END;
$$;

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
  v_id uuid;
  v_row public.builder_buildings%ROWTYPE;
BEGIN
  SELECT organization_id INTO v_org FROM public.builder_projects WHERE id = p_project_id;
  IF v_org IS NULL THEN
    RAISE EXCEPTION 'Project not found';
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

CREATE OR REPLACE FUNCTION public.update_builder_building(
  p_building_id uuid,
  p_name text DEFAULT NULL,
  p_code text DEFAULT NULL,
  p_tower_name text DEFAULT NULL,
  p_block_name text DEFAULT NULL,
  p_display_order integer DEFAULT NULL,
  p_floors_count integer DEFAULT NULL,
  p_units_count integer DEFAULT NULL,
  p_status text DEFAULT NULL,
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
  v_row public.builder_buildings%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_buildings WHERE id = p_building_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Building not found';
  END IF;

  IF NOT (public.is_super_admin() OR public.is_builder_admin(v_row.organization_id)) THEN
    RAISE EXCEPTION 'Not authorized to update buildings';
  END IF;

  UPDATE public.builder_buildings
  SET
    name = COALESCE(NULLIF(trim(COALESCE(p_name, '')), ''), name),
    code = COALESCE(NULLIF(upper(trim(COALESCE(p_code, ''))), ''), code),
    tower_name = CASE WHEN p_tower_name IS NULL THEN tower_name ELSE NULLIF(trim(p_tower_name), '') END,
    block_name = CASE WHEN p_block_name IS NULL THEN block_name ELSE NULLIF(trim(p_block_name), '') END,
    display_order = COALESCE(p_display_order, display_order),
    floors_count = COALESCE(p_floors_count, floors_count),
    units_count = COALESCE(p_units_count, units_count),
    status = COALESCE(p_status, status),
    description = CASE WHEN p_description IS NULL THEN description ELSE NULLIF(trim(p_description), '') END,
    image_url = CASE WHEN p_image_url IS NULL THEN image_url ELSE NULLIF(trim(p_image_url), '') END,
    address_line = CASE WHEN p_address_line IS NULL THEN address_line ELSE NULLIF(trim(p_address_line), '') END
  WHERE id = p_building_id
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Building code already exists for this project';
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_builder_building(p_building_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.builder_buildings%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.builder_buildings WHERE id = p_building_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Building not found';
  END IF;

  IF NOT (public.is_super_admin() OR public.is_builder_admin(v_row.organization_id)) THEN
    RAISE EXCEPTION 'Not authorized to archive buildings';
  END IF;

  UPDATE public.builder_buildings
  SET status = 'archived'
  WHERE id = p_building_id
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.builder_buildings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS builder_buildings_select ON public.builder_buildings;
CREATE POLICY builder_buildings_select
  ON public.builder_buildings
  FOR SELECT
  TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_builder_member(organization_id)
  );

DROP POLICY IF EXISTS builder_buildings_insert ON public.builder_buildings;
CREATE POLICY builder_buildings_insert
  ON public.builder_buildings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_super_admin()
    OR public.is_builder_admin(organization_id)
  );

DROP POLICY IF EXISTS builder_buildings_update ON public.builder_buildings;
CREATE POLICY builder_buildings_update
  ON public.builder_buildings
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

GRANT SELECT, INSERT, UPDATE ON public.builder_buildings TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_builder_buildings TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_builder_building TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_builder_building TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_builder_building TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_builder_building TO authenticated;

COMMIT;
