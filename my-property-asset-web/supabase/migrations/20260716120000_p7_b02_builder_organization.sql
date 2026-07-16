-- =============================================================================
-- P7 / Batch 2 — Builder Organization Vertical Slice (database only)
-- =============================================================================
-- Depends on: P6A, P6B
-- OUT OF SCOPE: projects, buildings, units, documents, branding tables, etc.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. builder_companies (1:1 with organizations.type = builder)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.builder_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.organizations (id) ON DELETE CASCADE,
  legal_name text NOT NULL,
  trading_name text,
  registration_number text,
  primary_contact_name text NOT NULL,
  primary_contact_email text NOT NULL,
  primary_contact_phone text,
  address_street text,
  address_city text,
  address_state text,
  address_postal_code text,
  address_country text,
  region text,
  plan_code text,
  white_label_enabled boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  CONSTRAINT builder_companies_org_is_builder CHECK (
    public.is_builder_org(organization_id)
  )
);

-- Relax CHECK that uses function during insert of org+company in same txn:
-- Prefer trigger validation instead of table CHECK on function (safer for create order).
ALTER TABLE public.builder_companies
  DROP CONSTRAINT IF EXISTS builder_companies_org_is_builder;

CREATE OR REPLACE FUNCTION public.enforce_builder_company_org_type()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_builder_org(NEW.organization_id) THEN
    RAISE EXCEPTION 'builder_companies.organization_id must reference a builder organization';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_builder_companies_org_type ON public.builder_companies;
CREATE TRIGGER trg_builder_companies_org_type
  BEFORE INSERT OR UPDATE OF organization_id
  ON public.builder_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_company_org_type();

CREATE INDEX IF NOT EXISTS idx_builder_companies_status
  ON public.builder_companies (status);

CREATE INDEX IF NOT EXISTS idx_builder_companies_email
  ON public.builder_companies (lower(primary_contact_email));

COMMENT ON TABLE public.builder_companies IS
  'P7 Batch 2 — Builder company profile bound to organizations(type=builder).';

-- -----------------------------------------------------------------------------
-- 2. builder_staff_invitations (Type A — invite builder owner/staff)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.builder_staff_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  builder_company_id uuid REFERENCES public.builder_companies (id) ON DELETE SET NULL,
  email text NOT NULL,
  invited_role text NOT NULL DEFAULT 'builder_owner'
    CHECK (
      public.normalize_platform_role(invited_role) IN (
        'builder_owner', 'builder_admin', 'builder_staff'
      )
    ),
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  invited_by uuid REFERENCES auth.users (id),
  accepted_by uuid REFERENCES auth.users (id),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  resend_count integer NOT NULL DEFAULT 0,
  last_sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_builder_staff_invitations_org
  ON public.builder_staff_invitations (organization_id);

CREATE INDEX IF NOT EXISTS idx_builder_staff_invitations_email
  ON public.builder_staff_invitations (lower(email));

CREATE INDEX IF NOT EXISTS idx_builder_staff_invitations_status
  ON public.builder_staff_invitations (status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_builder_staff_invitations_active_email_org
  ON public.builder_staff_invitations (organization_id, lower(email))
  WHERE status = 'pending';

COMMENT ON TABLE public.builder_staff_invitations IS
  'P7 Batch 2 — Invitations for builder_owner / builder_admin / builder_staff (Type A).';

-- -----------------------------------------------------------------------------
-- 3. RPC: create_builder_organization (Super Admin provisioning)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_builder_organization(
  p_legal_name text,
  p_trading_name text DEFAULT NULL,
  p_primary_contact_name text DEFAULT NULL,
  p_primary_contact_email text DEFAULT NULL,
  p_primary_contact_phone text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_plan_code text DEFAULT NULL,
  p_invite_owner boolean DEFAULT true,
  p_invitation_ttl_hours integer DEFAULT 168
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_company_id uuid;
  v_invite_id uuid;
  v_token text;
  v_expires timestamptz;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only super_admin may create builder organizations';
  END IF;

  IF p_legal_name IS NULL OR length(trim(p_legal_name)) = 0 THEN
    RAISE EXCEPTION 'legal_name is required';
  END IF;

  IF p_primary_contact_email IS NULL OR length(trim(p_primary_contact_email)) = 0 THEN
    RAISE EXCEPTION 'primary_contact_email is required';
  END IF;

  INSERT INTO public.organizations (name, organization_type, status)
  VALUES (trim(p_legal_name), 'builder', 'pending_approval')
  RETURNING id INTO v_org_id;

  -- Some Schema V2 orgs may require additional NOT NULL columns; callers must
  -- ensure base organizations insert shape matches production. Adjust as needed.

  INSERT INTO public.builder_companies (
    organization_id,
    legal_name,
    trading_name,
    primary_contact_name,
    primary_contact_email,
    primary_contact_phone,
    region,
    plan_code,
    status,
    created_by
  ) VALUES (
    v_org_id,
    trim(p_legal_name),
    NULLIF(trim(COALESCE(p_trading_name, '')), ''),
    COALESCE(NULLIF(trim(COALESCE(p_primary_contact_name, '')), ''), 'Builder Owner'),
    lower(trim(p_primary_contact_email)),
    NULLIF(trim(COALESCE(p_primary_contact_phone, '')), ''),
    NULLIF(trim(COALESCE(p_region, '')), ''),
    NULLIF(trim(COALESCE(p_plan_code, '')), ''),
    'pending',
    auth.uid()
  )
  RETURNING id INTO v_company_id;

  IF p_invite_owner THEN
    v_token := encode(gen_random_bytes(24), 'hex');
    v_expires := now() + make_interval(hours => GREATEST(p_invitation_ttl_hours, 1));

    INSERT INTO public.builder_staff_invitations (
      organization_id,
      builder_company_id,
      email,
      invited_role,
      token,
      status,
      invited_by,
      expires_at
    ) VALUES (
      v_org_id,
      v_company_id,
      lower(trim(p_primary_contact_email)),
      'builder_owner',
      v_token,
      'pending',
      auth.uid(),
      v_expires
    )
    RETURNING id INTO v_invite_id;
  END IF;

  RETURN jsonb_build_object(
    'organization_id', v_org_id,
    'builder_company_id', v_company_id,
    'invitation_id', v_invite_id,
    'invitation_token', v_token
  );
END;
$$;

COMMENT ON FUNCTION public.create_builder_organization IS
  'P7 — Super Admin creates builder org + company + optional owner invitation.';

-- -----------------------------------------------------------------------------
-- 4. RPC: accept_builder_invitation
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.accept_builder_invitation(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv public.builder_staff_invitations%ROWTYPE;
  v_role text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_inv
  FROM public.builder_staff_invitations
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF v_inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Invitation is not pending';
  END IF;

  IF v_inv.expires_at < now() THEN
    UPDATE public.builder_staff_invitations
    SET status = 'expired', updated_at = now()
    WHERE id = v_inv.id;
    RAISE EXCEPTION 'Invitation expired';
  END IF;

  v_role := public.normalize_platform_role(v_inv.invited_role);

  IF NOT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = v_inv.organization_id
      AND user_id = auth.uid()
  ) THEN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (v_inv.organization_id, auth.uid(), v_role);
  END IF;

  UPDATE public.builder_staff_invitations
  SET
    status = 'accepted',
    accepted_by = auth.uid(),
    accepted_at = now(),
    updated_at = now()
  WHERE id = v_inv.id;

  UPDATE public.builder_companies
  SET status = 'active', updated_at = now()
  WHERE id = v_inv.builder_company_id
    AND status = 'pending';

  UPDATE public.organizations
  SET status = 'active'
  WHERE id = v_inv.organization_id
    AND status = 'pending_approval';

  RETURN jsonb_build_object(
    'organization_id', v_inv.organization_id,
    'role', v_role,
    'builder_company_id', v_inv.builder_company_id
  );
END;
$$;

COMMENT ON FUNCTION public.accept_builder_invitation IS
  'P7 — Authenticated user accepts builder staff invitation and joins organization.';

CREATE OR REPLACE FUNCTION public.resend_builder_invitation(p_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv public.builder_staff_invitations%ROWTYPE;
  v_token text;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only super_admin may resend invitations';
  END IF;

  SELECT * INTO v_inv
  FROM public.builder_staff_invitations
  WHERE id = p_invitation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF v_inv.status = 'accepted' THEN
    RAISE EXCEPTION 'Cannot resend an accepted invitation';
  END IF;

  v_token := encode(gen_random_bytes(24), 'hex');

  UPDATE public.builder_staff_invitations
  SET
    token = v_token,
    status = 'pending',
    expires_at = now() + interval '7 days',
    resend_count = resend_count + 1,
    last_sent_at = now(),
    updated_at = now()
  WHERE id = p_invitation_id;

  RETURN jsonb_build_object(
    'invitation_id', p_invitation_id,
    'invitation_token', v_token,
    'resend_count', v_inv.resend_count + 1
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 5. Foundation RLS for builder org tables
-- -----------------------------------------------------------------------------

ALTER TABLE public.builder_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_staff_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS builder_companies_select ON public.builder_companies;
CREATE POLICY builder_companies_select
  ON public.builder_companies
  FOR SELECT
  TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_builder_member(organization_id)
  );

DROP POLICY IF EXISTS builder_companies_write_super_admin ON public.builder_companies;
CREATE POLICY builder_companies_write_super_admin
  ON public.builder_companies
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS builder_companies_update_builder_owner ON public.builder_companies;
CREATE POLICY builder_companies_update_builder_owner
  ON public.builder_companies
  FOR UPDATE
  TO authenticated
  USING (public.is_builder_admin(organization_id))
  WITH CHECK (public.is_builder_admin(organization_id));

DROP POLICY IF EXISTS builder_invitations_select ON public.builder_staff_invitations;
CREATE POLICY builder_invitations_select
  ON public.builder_staff_invitations
  FOR SELECT
  TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_builder_admin(organization_id)
    OR lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );

DROP POLICY IF EXISTS builder_invitations_write_super_admin ON public.builder_staff_invitations;
CREATE POLICY builder_invitations_write_super_admin
  ON public.builder_staff_invitations
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

GRANT SELECT, UPDATE ON public.builder_companies TO authenticated;
GRANT SELECT ON public.builder_staff_invitations TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_builder_organization TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_builder_invitation TO authenticated;
GRANT EXECUTE ON FUNCTION public.resend_builder_invitation TO authenticated;

COMMIT;
