-- P9.1 Batch 5 verification — run after 20260716150000_p91_b05_project_hierarchy.sql

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'builder_projects'
      AND column_name = 'project_hierarchy'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: builder_projects.project_hierarchy missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'enforce_builder_project_hierarchy'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: enforce_builder_project_hierarchy missing';
  END IF;

  RAISE NOTICE 'VERIFY OK: P9.1 Batch 5 project hierarchy';
END;
$$;
