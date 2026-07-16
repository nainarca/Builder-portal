-- =============================================================================
-- P12 / Batch 8 — Digital Handover & Owner Activation
-- =============================================================================
-- Depends on: P10 builder_units, P11 owner assignment, existing Flutter Schema V2
-- Focus: handover records, document package mapping, checklist, secure invitations,
-- owner activation linkages, and audit timeline.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. unit_handovers
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unit_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.builder_projects (id) ON DELETE CASCADE,
  building_id uuid REFERENCES public.builder_buildings (id) ON DELETE SET NULL,
  unit_id uuid NOT NULL REFERENCES public.builder_units (id) ON DELETE CASCADE,
  owner_assignment_id uuid NOT NULL REFERENCES public.builder_owner_assignments (id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft'
    CHECK (
      status IN (
        'draft',
        'in_progress',
        'invited',
        'accepted',
        'activated',
        'completed',
        'cancelled'
      )
    ),
  invitation_status text NOT NULL DEFAULT 'not_generated'
    CHECK (
      invitation_status IN (
        'not_generated',
        'pending',
        'accepted',
        'expired',
        'cancelled',
        'resent'
      )
    ),
  invitation_expires_at timestamptz,
  accepted_at timestamptz,
  activated_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_unit_handovers_active_unit
  ON public.unit_handovers (unit_id)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS idx_unit_handovers_org_status
  ON public.unit_handovers (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_unit_handovers_project_status
  ON public.unit_handovers (project_id, status);

-- -----------------------------------------------------------------------------
-- 2. unit_handover_documents
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unit_handover_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id uuid NOT NULL REFERENCES public.unit_handovers (id) ON DELETE CASCADE,
  document_id uuid NOT NULL,
  document_type text NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users (id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_handover_documents_handover_verified
  ON public.unit_handover_documents (handover_id, is_verified);

CREATE INDEX IF NOT EXISTS idx_unit_handover_documents_type
  ON public.unit_handover_documents (document_type);

-- -----------------------------------------------------------------------------
-- 3. unit_handover_checklists
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unit_handover_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id uuid NOT NULL REFERENCES public.unit_handovers (id) ON DELETE CASCADE,
  item_code text NOT NULL,
  item_label text NOT NULL,
  is_mandatory boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'blocked')),
  completed_at timestamptz,
  completed_by uuid REFERENCES auth.users (id),
  remarks text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_unit_handover_checklist_item UNIQUE (handover_id, item_code)
);

CREATE INDEX IF NOT EXISTS idx_unit_handover_checklists_handover_status
  ON public.unit_handover_checklists (handover_id, status);

CREATE INDEX IF NOT EXISTS idx_unit_handover_checklists_handover_order
  ON public.unit_handover_checklists (handover_id, display_order);

-- -----------------------------------------------------------------------------
-- 4. owner_invitations (Type B)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.owner_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  handover_id uuid NOT NULL REFERENCES public.unit_handovers (id) ON DELETE CASCADE,
  assignment_id uuid NOT NULL REFERENCES public.builder_owner_assignments (id) ON DELETE RESTRICT,
  prospect_id uuid NOT NULL REFERENCES public.builder_owner_prospects (id) ON DELETE RESTRICT,
  channel text NOT NULL DEFAULT 'email'
    CHECK (channel IN ('email')),
  token_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled', 'resent')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  cancelled_at timestamptz,
  resent_count integer NOT NULL DEFAULT 0 CHECK (resent_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_owner_invitations_active_handover
  ON public.owner_invitations (handover_id)
  WHERE status IN ('pending', 'resent');

CREATE UNIQUE INDEX IF NOT EXISTS uq_owner_invitations_token_hash
  ON public.owner_invitations (token_hash);

CREATE INDEX IF NOT EXISTS idx_owner_invitations_status
  ON public.owner_invitations (status, expires_at);

-- -----------------------------------------------------------------------------
-- 5. unit_property_links
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unit_property_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES public.builder_units (id) ON DELETE RESTRICT,
  handover_id uuid NOT NULL REFERENCES public.unit_handovers (id) ON DELETE RESTRICT,
  assignment_id uuid NOT NULL REFERENCES public.builder_owner_assignments (id) ON DELETE RESTRICT,
  owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  property_id uuid NOT NULL REFERENCES public.properties (id) ON DELETE RESTRICT,
  link_status text NOT NULL DEFAULT 'active'
    CHECK (link_status IN ('active', 'superseded')),
  activated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_unit_property_links_active_unit
  ON public.unit_property_links (unit_id)
  WHERE link_status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS uq_unit_property_links_active_property
  ON public.unit_property_links (property_id)
  WHERE link_status = 'active';

-- -----------------------------------------------------------------------------
-- 6. unit_handover_timeline_events
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unit_handover_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id uuid NOT NULL REFERENCES public.unit_handovers (id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_title text NOT NULL,
  event_description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  acted_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_handover_timeline_events_handover_created
  ON public.unit_handover_timeline_events (handover_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 7. Scope / status helpers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_handover_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_unit public.builder_units%ROWTYPE;
  v_assignment public.builder_owner_assignments%ROWTYPE;
BEGIN
  SELECT * INTO v_unit
  FROM public.builder_units
  WHERE id = NEW.unit_id;

  IF v_unit.id IS NULL THEN
    RAISE EXCEPTION 'Handover unit not found';
  END IF;

  SELECT * INTO v_assignment
  FROM public.builder_owner_assignments
  WHERE id = NEW.owner_assignment_id;

  IF v_assignment.id IS NULL THEN
    RAISE EXCEPTION 'Owner assignment not found';
  END IF;

  IF v_assignment.unit_id <> NEW.unit_id THEN
    RAISE EXCEPTION 'Owner assignment must reference the same unit as the handover';
  END IF;

  NEW.organization_id := v_unit.organization_id;
  NEW.project_id := v_unit.project_id;
  NEW.building_id := v_unit.building_id;
  NEW.updated_at := now();

  IF NEW.status = 'accepted' AND NEW.accepted_at IS NULL THEN
    NEW.accepted_at := now();
  END IF;
  IF NEW.status = 'activated' AND NEW.activated_at IS NULL THEN
    NEW.activated_at := now();
  END IF;
  IF NEW.status = 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  END IF;
  IF NEW.status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
    NEW.cancelled_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_unit_handovers_scope ON public.unit_handovers;
CREATE TRIGGER trg_unit_handovers_scope
  BEFORE INSERT OR UPDATE
  ON public.unit_handovers
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_handover_scope();

CREATE OR REPLACE FUNCTION public.owner_invitation_token_security()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.token_hash IS NULL OR length(trim(NEW.token_hash)) < 16 THEN
    RAISE EXCEPTION 'Invitation token hash is required';
  END IF;

  NEW.updated_at := now();

  IF NEW.status = 'accepted' AND NEW.accepted_at IS NULL THEN
    NEW.accepted_at := now();
  END IF;
  IF NEW.status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
    NEW.cancelled_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_owner_invitations_token_security ON public.owner_invitations;
CREATE TRIGGER trg_owner_invitations_token_security
  BEFORE INSERT OR UPDATE
  ON public.owner_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.owner_invitation_token_security();

CREATE OR REPLACE FUNCTION public.append_handover_timeline_event()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'unit_handovers' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.unit_handover_timeline_events (
        handover_id,
        event_type,
        event_title,
        event_description,
        metadata,
        acted_by
      ) VALUES (
        NEW.id,
        'handover_started',
        'Handover started',
        'Digital handover record created',
        jsonb_build_object('status', NEW.status),
        NEW.created_by
      );
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.unit_handover_timeline_events (
        handover_id,
        event_type,
        event_title,
        event_description,
        metadata,
        acted_by
      ) VALUES (
        NEW.id,
        'handover_status_changed',
        'Handover status updated',
        format('Status changed from %s to %s', OLD.status, NEW.status),
        jsonb_build_object('from', OLD.status, 'to', NEW.status),
        auth.uid()
      );
    END IF;
  ELSIF TG_TABLE_NAME = 'owner_invitations' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.unit_handover_timeline_events (
        handover_id,
        event_type,
        event_title,
        event_description,
        metadata,
        acted_by
      ) VALUES (
        NEW.handover_id,
        'invitation_generated',
        'Invitation generated',
        'Secure owner invitation generated',
        jsonb_build_object('channel', NEW.channel, 'expires_at', NEW.expires_at),
        NEW.created_by
      );
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.unit_handover_timeline_events (
        handover_id,
        event_type,
        event_title,
        event_description,
        metadata,
        acted_by
      ) VALUES (
        NEW.handover_id,
        CASE
          WHEN NEW.status = 'accepted' THEN 'invitation_accepted'
          WHEN NEW.status = 'cancelled' THEN 'invitation_cancelled'
          WHEN NEW.status = 'resent' THEN 'invitation_resent'
          WHEN NEW.status = 'expired' THEN 'invitation_expired'
          ELSE 'invitation_status_changed'
        END,
        'Invitation status updated',
        format('Invitation status changed from %s to %s', OLD.status, NEW.status),
        jsonb_build_object('from', OLD.status, 'to', NEW.status),
        auth.uid()
      );
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_unit_handovers_timeline ON public.unit_handovers;
CREATE TRIGGER trg_unit_handovers_timeline
  AFTER INSERT OR UPDATE
  ON public.unit_handovers
  FOR EACH ROW
  EXECUTE FUNCTION public.append_handover_timeline_event();

DROP TRIGGER IF EXISTS trg_owner_invitations_timeline ON public.owner_invitations;
CREATE TRIGGER trg_owner_invitations_timeline
  AFTER INSERT OR UPDATE
  ON public.owner_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.append_handover_timeline_event();

COMMENT ON TABLE public.unit_handovers IS
  'P12 Batch 8 — Digital handover records from assigned buyer through owner activation.';

COMMENT ON TABLE public.owner_invitations IS
  'P12 Batch 8 — Type B invitations for buyer-to-owner activation.';

COMMENT ON TABLE public.unit_property_links IS
  'P12 Batch 8 — Active link from builder unit handover to existing Flutter property record.';

COMMIT;
