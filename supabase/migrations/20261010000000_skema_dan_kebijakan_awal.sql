-- ==============================================================================
-- MIGRASI AWAL: SKEMA DATABASE LENGKAP PARABOT (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. EKSTENSI YANG DIPERLUKAN
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE jenis_karya AS ENUM ('web', 'unduhan', 'diy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE status_karya AS ENUM ('published', 'hidden', 'draft');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE platform_unduhan AS ENUM ('windows', 'android', 'ios', 'mac', 'linux', 'lainnya', 'berkas');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE kode_bagian_beranda AS ENUM (
    'hero',
    'dibangun_dengan',
    'karya_terbaru',
    'unggulan',
    'panel_angka',
    'cara_berkarya',
    'ekosistem',
    'cta'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. TABEL OTORISASI ADMIN
-- Email yang diizinkan mengelola konten melalui dashboard admin
CREATE TABLE IF NOT EXISTS public.admin_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. TABEL KATEGORI
CREATE TABLE IF NOT EXISTS public.kategori (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  urutan INT DEFAULT 0 NOT NULL,
  aktif BOOLEAN DEFAULT true NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. TABEL KARYA
CREATE TABLE IF NOT EXISTS public.karya (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  tagline TEXT,
  jenis jenis_karya DEFAULT 'web' NOT NULL,
  kategori_id UUID REFERENCES public.kategori(id) ON DELETE SET NULL,
  deskripsi TEXT, -- Markdown
  cara_penggunaan TEXT, -- Markdown
  url_utama TEXT,
  url_repositori TEXT,
  versi TEXT DEFAULT 'v1.0.0',
  platform TEXT,
  ikon_url TEXT,
  status status_karya DEFAULT 'draft' NOT NULL,
  unggulan BOOLEAN DEFAULT false NOT NULL,
  urutan INT DEFAULT 0 NOT NULL,
  tingkat_kesulitan TEXT, -- Khusus DIY: 'Mudah', 'Menengah', 'Lanjutan'
  estimasi_waktu TEXT, -- Khusus DIY: '30 Menit', '2 Jam'
  bahan_alat JSONB, -- Khusus DIY: [{"nama": "Node.js", "jumlah": "v18+"}]
  teknologi TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  tanggal_rilis DATE DEFAULT CURRENT_DATE NOT NULL,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. TABEL SCREENSHOT KARYA
CREATE TABLE IF NOT EXISTS public.karya_screenshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karya_id UUID REFERENCES public.karya(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  keterangan TEXT,
  urutan INT DEFAULT 0 NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. TABEL UNDUHAN KARYA
CREATE TABLE IF NOT EXISTS public.karya_unduhan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karya_id UUID REFERENCES public.karya(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  platform platform_unduhan DEFAULT 'berkas' NOT NULL,
  url_drive TEXT NOT NULL,
  ukuran_teks TEXT, -- Contoh: '12 MB', '140 KB'
  urutan INT DEFAULT 0 NOT NULL,
  jumlah_klik INT DEFAULT 0 NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. TABEL PENGATURAN SITUS (KEY-VALUE JSONB)
CREATE TABLE IF NOT EXISTS public.pengaturan_situs (
  kunci TEXT PRIMARY KEY,
  nilai JSONB NOT NULL,
  keterangan TEXT,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. TABEL MENU NAVIGASI
CREATE TABLE IF NOT EXISTS public.menu_navigasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  urutan INT DEFAULT 0 NOT NULL,
  tampil BOOLEAN DEFAULT true NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. TABEL BAGIAN BERANDA
CREATE TABLE IF NOT EXISTS public.bagian_beranda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode kode_bagian_beranda UNIQUE NOT NULL,
  judul TEXT,
  subjudul TEXT,
  konten JSONB DEFAULT '{}'::JSONB NOT NULL,
  urutan INT DEFAULT 0 NOT NULL,
  tampil BOOLEAN DEFAULT true NOT NULL,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 11. TABEL HALAMAN STATIS
CREATE TABLE IF NOT EXISTS public.halaman_statis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL, -- Markdown
  tampil BOOLEAN DEFAULT true NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  diperbarui_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- FUNGSI & TRIGGER OTOMATIS
-- ==============================================================================

-- 1. Trigger update diperbarui_pada otomatis
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diperbarui_pada = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kategori_updated_at ON public.kategori;
CREATE TRIGGER trg_kategori_updated_at
BEFORE UPDATE ON public.kategori
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_karya_updated_at ON public.karya;
CREATE TRIGGER trg_karya_updated_at
BEFORE UPDATE ON public.karya
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_karya_unduhan_updated_at ON public.karya_unduhan;
CREATE TRIGGER trg_karya_unduhan_updated_at
BEFORE UPDATE ON public.karya_unduhan
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_pengaturan_situs_updated_at ON public.pengaturan_situs;
CREATE TRIGGER trg_pengaturan_situs_updated_at
BEFORE UPDATE ON public.pengaturan_situs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_bagian_beranda_updated_at ON public.bagian_beranda;
CREATE TRIGGER trg_bagian_beranda_updated_at
BEFORE UPDATE ON public.bagian_beranda
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_halaman_statis_updated_at ON public.halaman_statis;
CREATE TRIGGER trg_halaman_statis_updated_at
BEFORE UPDATE ON public.halaman_statis
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Fungsi auto-generate slug jika kosong
CREATE OR REPLACE FUNCTION public.slugify(v_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        trim(v_text),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '[\s-]+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.handle_auto_slug_karya()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 1;
BEGIN
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    base_slug := public.slugify(NEW.nama);
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.karya WHERE slug = final_slug AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  ELSE
    NEW.slug := public.slugify(NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_karya_auto_slug ON public.karya;
CREATE TRIGGER trg_karya_auto_slug
BEFORE INSERT OR UPDATE OF nama, slug ON public.karya
FOR EACH ROW EXECUTE FUNCTION public.handle_auto_slug_karya();

-- 3. RPC Aman untuk Menambah Jumlah Klik Unduhan (Security Definer)
CREATE OR REPLACE FUNCTION public.tambah_klik_unduhan(p_unduhan_id UUID)
RETURNS INT AS $$
DECLARE
  v_klik_baru INT;
BEGIN
  UPDATE public.karya_unduhan
  SET jumlah_klik = jumlah_klik + 1,
      diperbarui_pada = TIMEZONE('utc', NOW())
  WHERE id = p_unduhan_id
  RETURNING jumlah_klik INTO v_klik_baru;

  RETURN COALESCE(v_klik_baru, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Berikan izin eksekusi RPC ke public (anon & authenticated)
GRANT EXECUTE ON FUNCTION public.tambah_klik_unduhan(UUID) TO anon, authenticated;

-- 4. VIEW PUBLIK: karya_publik
-- Menyatukan data karya berstatus 'published' bersama relasi kategori, screenshots, dan unduhan
CREATE OR REPLACE VIEW public.karya_publik AS
SELECT
  k.id,
  k.slug,
  k.nama,
  k.tagline,
  k.jenis,
  k.kategori_id,
  cat.nama AS kategori_nama,
  cat.slug AS kategori_slug,
  k.deskripsi,
  k.cara_penggunaan,
  k.url_utama,
  k.url_repositori,
  k.versi,
  k.platform,
  k.ikon_url,
  k.status,
  k.unggulan,
  k.urutan,
  k.tingkat_kesulitan,
  k.estimasi_waktu,
  k.bahan_alat,
  k.teknologi,
  k.tanggal_rilis,
  k.diperbarui_pada,
  k.dibuat_pada,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'url', s.url,
          'keterangan', s.keterangan,
          'urutan', s.urutan
        ) ORDER BY s.urutan ASC, s.dibuat_pada ASC
      )
      FROM public.karya_screenshot s
      WHERE s.karya_id = k.id
    ),
    '[]'::JSONB
  ) AS screenshots,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', u.id,
          'label', u.label,
          'platform', u.platform,
          'url_drive', u.url_drive,
          'ukuran_teks', u.ukuran_teks,
          'urutan', u.urutan,
          'jumlah_klik', u.jumlah_klik
        ) ORDER BY u.urutan ASC
      )
      FROM public.karya_unduhan u
      WHERE u.karya_id = k.id
    ),
    '[]'::JSONB
  ) AS unduhan
FROM public.karya k
LEFT JOIN public.kategori cat ON cat.id = k.kategori_id
WHERE k.status = 'published' AND (cat.aktif IS NULL OR cat.aktif = true);

-- Berikan akses select pada view ke publik
GRANT SELECT ON public.karya_publik TO anon, authenticated;

-- ==============================================================================
-- KEAMANAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Aktifkan RLS di SEMUA tabel
ALTER TABLE public.admin_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya_screenshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya_unduhan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan_situs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_navigasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bagian_beranda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halaman_statis ENABLE ROW LEVEL SECURITY;

-- Helper fungsi untuk mengecek apakah user saat ini adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_email ae
    WHERE ae.email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- 1. Pola RLS: admin_email ---
-- Hanya admin yang bisa membaca daftar admin, tidak ada akses anon
CREATE POLICY "Admin dapat melihat admin_email"
ON public.admin_email FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin dapat mengelola admin_email"
ON public.admin_email FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 2. Pola RLS: kategori ---
CREATE POLICY "Publik dapat membaca kategori aktif"
ON public.kategori FOR SELECT
TO public
USING (aktif = true OR public.is_admin());

CREATE POLICY "Admin kelola kategori penuh"
ON public.kategori FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 3. Pola RLS: karya ---
CREATE POLICY "Publik dapat membaca karya published"
ON public.karya FOR SELECT
TO public
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin kelola karya penuh"
ON public.karya FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 4. Pola RLS: karya_screenshot ---
CREATE POLICY "Publik dapat membaca screenshot karya published"
ON public.karya_screenshot FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.karya k
    WHERE k.id = karya_screenshot.karya_id
      AND (k.status = 'published' OR public.is_admin())
  )
);

CREATE POLICY "Admin kelola screenshot penuh"
ON public.karya_screenshot FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 5. Pola RLS: karya_unduhan ---
CREATE POLICY "Publik dapat membaca unduhan karya published"
ON public.karya_unduhan FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.karya k
    WHERE k.id = karya_unduhan.karya_id
      AND (k.status = 'published' OR public.is_admin())
  )
);

CREATE POLICY "Admin kelola unduhan penuh"
ON public.karya_unduhan FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 6. Pola RLS: pengaturan_situs ---
CREATE POLICY "Publik dapat membaca pengaturan situs"
ON public.pengaturan_situs FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin kelola pengaturan situs penuh"
ON public.pengaturan_situs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 7. Pola RLS: menu_navigasi ---
CREATE POLICY "Publik dapat membaca menu yang tampil"
ON public.menu_navigasi FOR SELECT
TO public
USING (tampil = true OR public.is_admin());

CREATE POLICY "Admin kelola menu navigasi penuh"
ON public.menu_navigasi FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 8. Pola RLS: bagian_beranda ---
CREATE POLICY "Publik dapat membaca bagian beranda yang tampil"
ON public.bagian_beranda FOR SELECT
TO public
USING (tampil = true OR public.is_admin());

CREATE POLICY "Admin kelola bagian beranda penuh"
ON public.bagian_beranda FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- 9. Pola RLS: halaman_statis ---
CREATE POLICY "Publik dapat membaca halaman statis yang tampil"
ON public.halaman_statis FOR SELECT
TO public
USING (tampil = true OR public.is_admin());

CREATE POLICY "Admin kelola halaman statis penuh"
ON public.halaman_statis FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKET: aset-parabot
-- ==============================================================================
-- Pembuatan bucket publik 'aset-parabot' (maks 2MB, ekstensi gambar/svg)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aset-parabot',
  'aset-parabot',
  true,
  2097152, -- 2 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- Kebijakan Storage: Baca publik
DROP POLICY IF EXISTS "Aset publik dapat dibaca semua orang" ON storage.objects;
CREATE POLICY "Aset publik dapat dibaca semua orang"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aset-parabot');

-- Kebijakan Storage: Tulis/Upload hanya Admin
DROP POLICY IF EXISTS "Hanya admin yang dapat mengunggah aset" ON storage.objects;
CREATE POLICY "Hanya admin yang dapat mengunggah aset"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'aset-parabot' AND public.is_admin()
);

-- Kebijakan Storage: Update hanya Admin
DROP POLICY IF EXISTS "Hanya admin yang dapat memperbarui aset" ON storage.objects;
CREATE POLICY "Hanya admin yang dapat memperbarui aset"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'aset-parabot' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'aset-parabot' AND public.is_admin()
);

-- Kebijakan Storage: Hapus hanya Admin
DROP POLICY IF EXISTS "Hanya admin yang dapat menghapus aset" ON storage.objects;
CREATE POLICY "Hanya admin yang dapat menghapus aset"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'aset-parabot' AND public.is_admin()
);
