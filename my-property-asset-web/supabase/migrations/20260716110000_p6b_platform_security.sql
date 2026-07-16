-- =============================================================================
-- P6B — Platform Security SQL Implementation
-- =============================================================================
-- Depends on: P6A (20260716100000_p6a_b01a_platform_foundation.sql)
-- Branch:     feature/platform-database
--
-- IN SCOPE
--   1. Platform role catalog (preserves Schema V2 role "owner")
--   2. platform_operators (super_admin / platform operator identities)
--   3. Security helper functions
--   4. Platform security views
--   5. Foundation RLS on NEW platform tables only
--   6. Permission helpers for future Builder Portal
--
-- OUT OF SCOPE
--   Projects, buildings, units, invitations, documents, branding,
--   subscriptions, announcements, notifications, Builder Portal tables,
--   RLS on properties / loans / expenses / tenants / financial_history,
--   replacing existing Personal Workspace RLS policies
--
-- Role codes (canonical DB values — P6B):
--   super_admin | builder_owner | builder_admin | builder_staff | owner | tenant
-- Aliases accepted by normalize_platform_role():
--   super-admin → super_admin
--   builder-org-owner → builder_owner
--   builder-org-admin → builder_admin
--   builder-org-member → builder_staff
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Platform role catalog
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_role_catalog (
  role_code text PRIMARY KEY,
  display_name text NOT NULL,
  role_family text NOT NULL
    CHECK (role_family IN ('system', 'builder', 'personal', 'tenant')),
  description text,
  is_web_portal_role boolean NOT NULL DEFAULT false,
  is_flutter_role boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.platform_role_catalog IS
  'P6B — Canonical platform roles. Schema V2 owner is preserved for Flutter Personal Workspaces.';

INSERT INTO public.platform_role_catalog (
  role_code, display_name, role_family, description, is_web_portal_role, is_flutter_role
) VALUES
  ('super_admin',   'Super Admin',            'system',   'Platform administrator', true,  false),
  ('builder_owner', 'Builder Owner',          'builder',  'Builder organization owner', true,  false),
  ('builder_admin', 'Builder Admin',          'builder',  'Builder organization admin', true,  false),
  ('builder_staff', 'Builder Staff',          'builder',  'Builder organization staff/member', true,  false),
  ('owner',         'Owner (Personal Workspace)', 'personal', 'Flutter Personal Workspace owner — Schema V2 compatible', false, true),
  ('tenant',        'Tenant',                 'tenant',   'Tenant access (Flutter / future) — not a Web portal role', false, true)
ON CONFLICT (role_code) DO UPDATE
SET
  display_name = EXCLUDED.display_name,
  role_family = EXCLUDED.role_family,
  description = EXCLUDED.description,
  is_web_portal_role = EXCLUDED.is_web_portal_role,
  is_flutter_role = EXCLUDED.is_flutter_role;

-- -----------------------------------------------------------------------------
-- 2. Platform operators (system roles — not org-scoped)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_operators (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  operator_role text NOT NULL DEFAULT 'super_admin'
    CHECK (operator_role IN ('super_admin')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  notes text
);

COMMENT ON TABLE public.platform_operators IS
  'P6B — Platform operators (super_admin). Separate from organization_members.';

CREATE INDEX IF NOT EXISTS idx_platform_operators_active
  ON public.platform_operators (is_active)
  WHERE is_active = true;

-- -----------------------------------------------------------------------------
-- 3. Role normalization + catalog helpers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.normalize_platform_role(p_role text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE lower(trim(COALESCE(p_role, '')))
    WHEN 'super_admin' THEN 'super_admin'
    WHEN 'super-admin' THEN 'super_admin'
    WHEN 'builder_owner' THEN 'builder_owner'
    WHEN 'builder-org-owner' THEN 'builder_owner'
    WHEN 'builder_admin' THEN 'builder_admin'
    WHEN 'builder-org-admin' THEN 'builder_admin'
    WHEN 'builder_staff' THEN 'builder_staff'
    WHEN 'builder-org-member' THEN 'builder_staff'
    WHEN 'builder_member' THEN 'builder_staff'
    WHEN 'owner' THEN 'owner'
    WHEN 'tenant' THEN 'tenant'
    WHEN 'tenant-portal-user' THEN 'tenant'
    ELSE NULL
  END;
$$;

COMMENT ON FUNCTION public.normalize_platform_role(text) IS
  'P6B — Maps aliases (incl. P1 hyphenated ids) to canonical role codes. Preserves owner.';

CREATE OR REPLACE FUNCTION public.is_valid_platform_role(p_role text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.normalize_platform_role(p_role) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.platform_role_catalog c
      WHERE c.role_code = public.normalize_platform_role(p_role)
    );
$$;

CREATE OR REPLACE FUNCTION public.is_builder_platform_role(p_role text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT public.normalize_platform_role(p_role) IN (
    'builder_owner', 'builder_admin', 'builder_staff'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_personal_owner_role(p_role text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT public.normalize_platform_role(p_role) = 'owner';
$$;

-- -----------------------------------------------------------------------------
-- 4. Auth context helpers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_operators po
    WHERE po.user_id = auth.uid()
      AND po.is_active = true
      AND po.operator_role = 'super_admin'
  );
$$;

COMMENT ON FUNCTION public.is_super_admin() IS
  'P6B — True when the current auth user is an active super_admin operator.';

CREATE OR REPLACE FUNCTION public.is_platform_operator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_super_admin();
$$;

-- Optional JWT claim overrides (set by app / custom access token hook later)
CREATE OR REPLACE FUNCTION public.jwt_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(auth.jwt() ->> 'organization_id', '')::uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_current_organization()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
BEGIN
  -- 1) Explicit JWT claim when present (Web session / custom access token)
  v_org := public.jwt_organization_id();
  IF v_org IS NOT NULL THEN
    RETURN v_org;
  END IF;

  -- 2) Flutter-compatible fallback: Personal Workspace membership
  --    (does not invent builder context; preserves Personal Workspace behavior)
  SELECT om.organization_id
  INTO v_org
  FROM public.organization_members om
  JOIN public.organizations o ON o.id = om.organization_id
  WHERE om.user_id = auth.uid()
    AND o.organization_type = 'personal'
  LIMIT 1;

  RETURN v_org;
END;
$$;

COMMENT ON FUNCTION public.get_current_organization() IS
  'P6B — Resolves current org from JWT claim, else personal membership fallback. Does not invent builder context.';

CREATE OR REPLACE FUNCTION public.get_current_builder()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
BEGIN
  v_org := public.jwt_organization_id();

  IF v_org IS NOT NULL AND public.is_builder_org(v_org) THEN
    RETURN v_org;
  END IF;

  -- Active builder membership (first). No builder orgs exist until Batch 2+.
  SELECT om.organization_id
  INTO v_org
  FROM public.organization_members om
  JOIN public.organizations o ON o.id = om.organization_id
  WHERE om.user_id = auth.uid()
    AND o.organization_type = 'builder'
    AND public.is_builder_platform_role(om.role)
  LIMIT 1;

  RETURN v_org;
END;
$$;

COMMENT ON FUNCTION public.get_current_builder() IS
  'P6B — Resolves current Builder Organization for the auth user, or NULL.';

-- -----------------------------------------------------------------------------
-- 5. Membership / role helpers (foundation for future Builder RLS)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_org_member(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = p_organization_id
      AND om.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_builder_member(p_organization_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
BEGIN
  v_org := COALESCE(p_organization_id, public.get_current_builder());
  IF v_org IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = v_org
      AND om.user_id = auth.uid()
      AND o.organization_type = 'builder'
      AND public.is_builder_platform_role(om.role)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_builder_owner(p_organization_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
BEGIN
  v_org := COALESCE(p_organization_id, public.get_current_builder());
  IF v_org IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = v_org
      AND om.user_id = auth.uid()
      AND o.organization_type = 'builder'
      AND public.normalize_platform_role(om.role) = 'builder_owner'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_builder_admin(p_organization_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
BEGIN
  v_org := COALESCE(p_organization_id, public.get_current_builder());
  IF v_org IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = v_org
      AND om.user_id = auth.uid()
      AND o.organization_type = 'builder'
      AND public.normalize_platform_role(om.role) IN ('builder_owner', 'builder_admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_builder_role(
  p_organization_id uuid,
  VARIADIC p_roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = p_organization_id
      AND om.user_id = auth.uid()
      AND o.organization_type = 'builder'
      AND public.normalize_platform_role(om.role) = ANY (
        SELECT public.normalize_platform_role(r) FROM unnest(p_roles) AS r
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_builder_org(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_super_admin()
    OR public.is_builder_member(p_organization_id);
$$;

CREATE OR REPLACE FUNCTION public.can_access_personal_org(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Personal Workspace: member only (typically role owner). Super Admin does NOT
  -- gain standing access to Restricted-Financial via this helper.
  SELECT public.is_personal_org(p_organization_id)
    AND public.is_org_member(p_organization_id);
$$;

-- Permission helpers for future Builder Portal policies
CREATE OR REPLACE FUNCTION public.has_platform_permission_scope(
  p_organization_id uuid,
  p_required_roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_super_admin()
    OR (
      public.is_builder_org(p_organization_id)
      AND public.has_builder_role(p_organization_id, VARIADIC p_required_roles)
    );
$$;

-- -----------------------------------------------------------------------------
-- 6. Platform security views
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_platform_users AS
SELECT
  u.id AS user_id,
  u.email,
  u.created_at AS auth_created_at,
  po.operator_role,
  po.is_active AS is_platform_operator_active,
  public.is_super_admin() AS viewer_is_super_admin
FROM auth.users u
LEFT JOIN public.platform_operators po ON po.user_id = u.id;

COMMENT ON VIEW public.v_platform_users IS
  'P6B — Platform user directory base. Restrict via RLS/grants; Super Admin intended audience.';

CREATE OR REPLACE VIEW public.v_super_admin_users AS
SELECT
  po.user_id,
  u.email,
  po.operator_role,
  po.is_active,
  po.created_at,
  po.updated_at,
  po.notes
FROM public.platform_operators po
JOIN auth.users u ON u.id = po.user_id
WHERE po.operator_role = 'super_admin'
  AND po.is_active = true;

COMMENT ON VIEW public.v_super_admin_users IS
  'P6B — Active Super Admin operators.';

CREATE OR REPLACE VIEW public.v_builder_members AS
SELECT
  om.id AS membership_id,
  om.organization_id,
  o.name AS organization_name,
  o.organization_type,
  o.status AS organization_status,
  om.user_id,
  u.email AS user_email,
  om.role AS raw_role,
  public.normalize_platform_role(om.role) AS platform_role,
  om.user_id AS membership_user_id
FROM public.organization_members om
JOIN public.organizations o ON o.id = om.organization_id
LEFT JOIN auth.users u ON u.id = om.user_id
WHERE o.organization_type = 'builder'
  AND public.is_builder_platform_role(om.role);

COMMENT ON VIEW public.v_builder_members IS
  'P6B — Builder organization memberships only. Empty until Batch 2+ creates builder orgs/members.';

-- -----------------------------------------------------------------------------
-- 7. Foundation RLS — NEW platform tables only
--    Does NOT alter existing organizations / members / properties / financial RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.platform_role_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_operators ENABLE ROW LEVEL SECURITY;

-- Role catalog: readable by authenticated users; writable by super_admin only
DROP POLICY IF EXISTS platform_role_catalog_select_authenticated ON public.platform_role_catalog;
CREATE POLICY platform_role_catalog_select_authenticated
  ON public.platform_role_catalog
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS platform_role_catalog_write_super_admin ON public.platform_role_catalog;
CREATE POLICY platform_role_catalog_write_super_admin
  ON public.platform_role_catalog
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Operators: super_admin full access; users can read their own operator row
DROP POLICY IF EXISTS platform_operators_select_self_or_admin ON public.platform_operators;
CREATE POLICY platform_operators_select_self_or_admin
  ON public.platform_operators
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS platform_operators_write_super_admin ON public.platform_operators;
CREATE POLICY platform_operators_write_super_admin
  ON public.platform_operators
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Grants (functions used by RLS must be executable)
GRANT SELECT ON public.platform_role_catalog TO authenticated;
GRANT SELECT ON public.platform_operators TO authenticated;
GRANT SELECT ON public.v_builder_members TO authenticated;
GRANT SELECT ON public.v_super_admin_users TO authenticated;
-- v_platform_users spans auth.users — grant cautiously to authenticated;
-- Super Admin apps should query via service role or tightened policy later.
GRANT SELECT ON public.v_platform_users TO authenticated;

GRANT EXECUTE ON FUNCTION public.normalize_platform_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_platform_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_builder_platform_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_personal_owner_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_platform_operator() TO authenticated;
GRANT EXECUTE ON FUNCTION public.jwt_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_organization() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_builder() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_builder_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_builder_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_builder_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_builder_role(uuid, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_builder_org(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_personal_org(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_platform_permission_scope(uuid, text[]) TO authenticated;

COMMIT;
