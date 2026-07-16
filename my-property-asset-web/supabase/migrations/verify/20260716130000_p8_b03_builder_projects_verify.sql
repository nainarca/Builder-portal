-- P8 Batch 3 verification — run after 20260716130000_p8_b03_builder_projects.sql

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'builder_projects'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: builder_projects missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'list_builder_projects'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: list_builder_projects missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'create_builder_project'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: create_builder_project missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_builder_project'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: update_builder_project missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'archive_builder_project'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: archive_builder_project missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'get_builder_project'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: get_builder_project missing';
  END IF;

  RAISE NOTICE 'VERIFY OK: P8 Batch 3 builder_projects';
END;
$$;
