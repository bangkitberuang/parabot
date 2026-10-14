-- ==============================================================================
-- MIGRASI: Menambahkan jenis_karya 'mobile' (Aplikasi Mobile)
-- ==============================================================================

-- 1. Tambahkan value 'mobile' ke enum jenis_karya jika belum ada
DO $$
BEGIN
  ALTER TYPE public.jenis_karya ADD VALUE IF NOT EXISTS 'mobile';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
