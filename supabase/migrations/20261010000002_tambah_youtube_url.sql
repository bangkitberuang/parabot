-- ==============================================================================
-- MIGRASI: Menambahkan kolom youtube_url pada tabel karya & perbarui view karya_publik
-- ==============================================================================

-- 1. Tambah kolom youtube_url ke tabel public.karya
ALTER TABLE public.karya
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- 2. Perbarui VIEW public.karya_publik agar menyertakan kolom youtube_url
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
  k.youtube_url,
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

GRANT SELECT ON public.karya_publik TO anon, authenticated;
