-- P9 Batch 4 verification — run after 20260716140000_p9_b04_builder_buildings.sql

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'builder_buildings'
  ) THEN
    RAISE EXCEPTION 'VERIFY FAIL: builder_buildings missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'list_builder_buildings') THEN
    RAISE EXCEPTION 'VERIFY FAIL: list_builder_buildings missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_builder_building') THEN
    RAISE EXCEPTION 'VERIFY FAIL: get_builder_building missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_builder_building') THEN
    RAISE EXCEPTION 'VERIFY FAIL: create_builder_building missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_builder_building') THEN
    RAISE EXCEPTION 'VERIFY FAIL: update_builder_building missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'archive_builder_building') THEN
    RAISE EXCEPTION 'VERIFY FAIL: archive_builder_building missing';
  END IF;

  RAISE NOTICE 'VERIFY OK: P9 Batch 4 builder_buildings';
END;
$$;
