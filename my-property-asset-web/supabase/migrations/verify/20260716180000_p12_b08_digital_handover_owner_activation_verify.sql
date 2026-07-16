-- P12 Batch 8 verification — run after 20260716180000_p12_b08_digital_handover_owner_activation.sql

DO $$
BEGIN
  IF to_regclass('public.unit_handovers') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: unit_handovers missing';
  END IF;

  IF to_regclass('public.unit_handover_documents') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: unit_handover_documents missing';
  END IF;

  IF to_regclass('public.unit_handover_checklists') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: unit_handover_checklists missing';
  END IF;

  IF to_regclass('public.owner_invitations') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: owner_invitations missing';
  END IF;

  IF to_regclass('public.unit_property_links') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: unit_property_links missing';
  END IF;

  IF to_regclass('public.unit_handover_timeline_events') IS NULL THEN
    RAISE EXCEPTION 'VERIFY FAIL: unit_handover_timeline_events missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'enforce_handover_scope') THEN
    RAISE EXCEPTION 'VERIFY FAIL: enforce_handover_scope missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'owner_invitation_token_security') THEN
    RAISE EXCEPTION 'VERIFY FAIL: owner_invitation_token_security missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'append_handover_timeline_event') THEN
    RAISE EXCEPTION 'VERIFY FAIL: append_handover_timeline_event missing';
  END IF;

  RAISE NOTICE 'VERIFY OK: P12 Batch 8 digital handover & owner activation';
END;
$$;
