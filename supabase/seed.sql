-- ==============================================================================
-- SEED DATA AWAL PARABOT (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. DAFTAR ADMIN AWAL
-- Catatan: Ganti email di bawah ini dengan email akun admin Supabase Anda
INSERT INTO public.admin_email (email)
VALUES ('admin@parabot.id')
ON CONFLICT (email) DO NOTHING;

-- 2. PENGATURAN SITUS LENGKAP (KEY-VALUE JSONB)
INSERT INTO public.pengaturan_situs (kunci, nilai, keterangan)
VALUES
  ('nama_brand', '"PARABOT"'::jsonb, 'Nama brand utama'),
  ('tagline_brand', '"Digital Workspace & Product Showcase"'::jsonb, 'Tagline ringkas brand'),
  ('logo_url', '"/logo.svg"'::jsonb, 'URL file logo'),
  ('favicon_url', '"/favicon.ico"'::jsonb, 'URL favicon'),
  ('warna_aksen', '"#2563EB"'::jsonb, 'Warna primer aksen (Tailwind Blue-600)'),
  ('mode_tema_default', '"light"'::jsonb, 'Mode tema awal: light atau dark'),
  ('hero_judul', '"Karya Digital, Solusi Praktis & Nyata."'::jsonb, 'Judul utama pada area Hero'),
  ('hero_subjudul', '"Sentralisasi perangkat lunak, sistem administrasi, dan piranti digital yang dikembangkan untuk mempercepat transformasi operasional dan memangkas alur birokrasi manual."'::jsonb, 'Subjudul area Hero'),
  ('hero_tombol_utama', '{"teks": "Lihat Koleksi Aplikasi", "href": "#katalog"}'::jsonb, 'Aksi tombol utama di Hero'),
  ('hero_tombol_kedua', '{"teks": "Pelajari Fitur", "href": "#keunggulan"}'::jsonb, 'Aksi tombol kedua di Hero'),
  ('teks_footer', '"Etalase dan studio produk digital mandiri oleh Bangkit Beruang Dev yang dirancang untuk mendukung operasional kerja lebih gesit, rapi, dan berbasis data."'::jsonb, 'Deskripsi paragraf di footer'),
  ('disclaimer', '"© 2026 PARABOT. Dibangun dengan integritas & dedikasi solusi digital."'::jsonb, 'Teks hak cipta / disclaimer'),
  ('kontak_email', '"halo@parabot.id"'::jsonb, 'Alamat email korespondensi'),
  ('kontak_whatsapp', '"6281234567890"'::jsonb, 'Nomor WhatsApp resmi'),
  ('tautan_sosial', '[
    {"platform": "github", "label": "GitHub", "url": "https://github.com"},
    {"platform": "linkedin", "label": "LinkedIn", "url": "https://linkedin.com"}
  ]'::jsonb, 'Daftar media sosial aktif'),
  ('seo_judul', '"PARABOT - Showcase Produk Digital & Solusi Aplikasi"'::jsonb, 'Judul meta SEO'),
  ('seo_deskripsi', '"Koleksi aplikasi, alat kerja, dan produk digital modern untuk efisiensi ekosistem kerja."'::jsonb, 'Deskripsi meta SEO'),
  ('seo_og_gambar', '"/og-image.png"'::jsonb, 'Gambar pratinjau Open Graph saat link dibagikan'),
  ('hero_banner_url', '"/gedung-sate-angle.png"'::jsonb, 'URL gambar banner hero atas'),
  ('hero_banner_posisi', '"center 85%"'::jsonb, 'Posisi background banner hero (mis: center top, center 85%, dll)'),
  ('hero_banner_opacity', '60'::jsonb, 'Tingkat opasitas banner hero dalam persen (0-100)'),
  ('footer_banner_url', '"/gedung-sate-wide.png"'::jsonb, 'URL gambar latar footer bawah'),
  ('footer_banner_posisi', '"center top"'::jsonb, 'Posisi background banner footer (mis: center top, center bottom, dll)'),
  ('footer_banner_opacity', '60'::jsonb, 'Tingkat opasitas banner footer dalam persen (0-100)')
ON CONFLICT (kunci) DO UPDATE SET
  nilai = EXCLUDED.nilai,
  keterangan = EXCLUDED.keterangan;

-- 3. MENU NAVIGASI PUBLIK
INSERT INTO public.menu_navigasi (label, href, urutan, tampil)
VALUES
  ('Beranda', '/', 1, true),
  ('Keunggulan', '/#keunggulan', 2, true),
  ('Koleksi Aplikasi', '/#katalog', 3, true),
  ('Alur Kerja', '/#langkah', 4, true),
  ('Tentang', '/tentang', 5, true)
ON CONFLICT DO NOTHING;

-- 4. BAGIAN BERANDA (SECTION ORDER & VISIBILITY)
INSERT INTO public.bagian_beranda (kode, judul, subjudul, konten, urutan, tampil)
VALUES
  (
    'hero',
    'Karya Digital, Solusi Praktis & Nyata.',
    'Sentralisasi perangkat lunak, sistem administrasi, dan piranti digital yang dikembangkan untuk mempercepat transformasi operasional.',
    '{"badge": "Etalase Produk & Solusi Digital Modern"}'::jsonb,
    1,
    true
  ),
  (
    'panel_angka',
    'Indikator Performa & Efisiensi Ekosistem',
    'Metrik nyata yang dihitung dari total modul terpasang dan aktivitas riil pengguna.',
    '{"aktif": true}'::jsonb,
    2,
    true
  ),
  (
    'ekosistem',
    'Mengapa Memilih Ekosistem PARABOT?',
    'Setiap aplikasi dirancang berdasar kebutuhan operasional riil dengan standar UI yang bersih dan alur tanpa hambatan.',
    '{"items": [
      {"ikon": "Layers", "judul": "Desain Modular Terstruktur", "deskripsi": "Arsitektur kode dan antarmuka komponen yang dapat dipasang ulang secara fleksibel."},
      {"ikon": "Workflow", "judul": "Alur Kerja Cepat & Ringkas", "deskripsi": "Memangkas rantai birokrasi berbelit. Pengguna dapat menginput data dan menyaring berkas seketika."},
      {"ikon": "Shield", "judul": "Keamanan & Privasi Data", "deskripsi": "Pemisahan otentikasi ketat dan penyimpanan terlindungi menjaga kerahasiaan data internal."}
    ]}'::jsonb,
    3,
    true
  ),
  (
    'karya_terbaru',
    'Jelajahi Solusi Siap Pakai',
    'Pilih produk digital sesuai fungsi dan kategori tugas yang ingin dioptimalkan.',
    '{}'::jsonb,
    4,
    true
  ),
  (
    'cara_berkarya',
    'Cara Menjelajahi & Memanfaatkan Karya',
    'Tiga langkah mudah untuk mulai memanfaatkan ekosistem digital PARABOT.',
    '{"langkah": [
      {"nomor": "01", "judul": "Pilih Kebutuhan", "deskripsi": "Temukan aplikasi yang relevan berdasarkan kendala teknis atau beban kerja operasional Anda."},
      {"nomor": "02", "judul": "Pelajari Fitur", "deskripsi": "Periksa dokumentasi, antarmuka kerja, dan gambaran cara pakai dalam lembar info ringkas."},
      {"nomor": "03", "judul": "Mulai Gunakan", "deskripsi": "Akses modul langsung di peramban tanpa perlu konfigurasi server rumit atau instalasi manual."}
    ]}'::jsonb,
    5,
    true
  ),
  (
    'cta',
    'Siap Mengembangkan Solusi Baru?',
    'Diskusikan integrasi dan kebutuhan otomatisasi sistem Anda bersama Bangkit Beruang Dev.',
    '{"tombol": {"teks": "Hubungi Pengembang", "href": "mailto:halo@parabot.id"}}'::jsonb,
    6,
    true
  )
ON CONFLICT (kode) DO UPDATE SET
  judul = EXCLUDED.judul,
  subjudul = EXCLUDED.subjudul,
  konten = EXCLUDED.konten,
  urutan = EXCLUDED.urutan,
  tampil = EXCLUDED.tampil;

-- 5. HALAMAN STATIS: TENTANG
INSERT INTO public.halaman_statis (slug, judul, isi, tampil)
VALUES (
  'tentang',
  'Tentang PARABOT & Bangkit Beruang Dev',
  '## Tentang Inisiatif PARABOT

**PARABOT** lahir dari kesadaran bahwa birokrasi dan ekosistem kerja publik membutuhkan piranti digital yang gesit, langsung menyelesaikan masalah inti, dan tidak berbelit-belit.

Studio ini diprakarsai oleh **Bangkit Beruang Dev** sebagai ruang eksplorasi teknis untuk menghasilkan:
- Aplikasi web yang ramah pengguna.
- Piranti otomasi dokumen dan tata kelola arsip.
- Dokumentasi panduan mandiri (DIY) yang dapat direplikasi oleh tim lain.

### Nilai yang Dijunjung
1. **Solutif:** Menolak penambahan fitur berlebihan yang tidak esensial.
2. **Mandiri & Terbuka:** Menggunakan tumpukan teknologi modern yang tangguh tanpa ketergantungan lisensi komersial tertutup.
3. **Dokumentasi Terstruktur:** Memastikan setiap pengguna memahami alur pemanfaatan secara utuh.',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  judul = EXCLUDED.judul,
  isi = EXCLUDED.isi,
  tampil = EXCLUDED.tampil;

-- 6. DATA KATEGORI AWAL (3 Kategori)
INSERT INTO public.kategori (id, nama, slug, urutan, aktif)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Produktivitas & Alur Proyek', 'produktivitas', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Administrasi & Pengarsipan', 'administrasi', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Komunikasi & Rekayasa DIY', 'komunikasi-diy', 3, true)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  slug = EXCLUDED.slug,
  urutan = EXCLUDED.urutan,
  aktif = EXCLUDED.aktif;

-- 7. DATA KARYA AWAL (5 Contoh: 3 Web/Unduhan, 2 DIY)

-- Karya 1 (Web): KARSA
INSERT INTO public.karya (
  id, slug, nama, tagline, jenis, kategori_id,
  deskripsi, cara_penggunaan, url_utama, url_repositori,
  versi, platform, ikon_url, status, unggulan, urutan, teknologi, tanggal_rilis
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'karsa-project-planner',
  'KARSA',
  'Sistem Perencanaan & Pelacak Alur Proyek Terstruktur',
  'web',
  'c1000000-0000-0000-0000-000000000001',
  'Ruang kolaborasi teknis untuk menyusun roadmap sprint, integrasi modul backlog, serta timeline eksekusi yang transparan bagi tim pengembang dan birokrasi.',
  '1. Masuk ke aplikasi melalui tautan web utama.
2. Buat papan proyek baru atau pilih divisi yang bersangkutan.
3. Tambahkan tugas dan atur jadwal penanggung jawab sprint.',
  'https://karsa.parabot.internal',
  'https://github.com/bangkitberuang/karsa',
  'v1.4.0',
  'Web Browser',
  '/icons/karsa.svg',
  'published',
  true,
  1,
  ARRAY['Next.js', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'],
  '2026-01-15'
)
ON CONFLICT (id) DO NOTHING;

-- Karya 2 (Unduhan/Web): RANTANG
INSERT INTO public.karya (
  id, slug, nama, tagline, jenis, kategori_id,
  deskripsi, cara_penggunaan, url_utama, url_repositori,
  versi, platform, ikon_url, status, unggulan, urutan, teknologi, tanggal_rilis
)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'rantang-berkas-gawe',
  'RANTANG',
  'Repositori Berkas & Dokumen Gawe ASN',
  'unduhan',
  'c1000000-0000-0000-0000-000000000002',
  'Sentralisasi notulensi, draf regulasi, berkas dinas, dan arsip digital dengan pencarian instan dan otorisasi aman tanpa perantara rumit.',
  '1. Unduh paket penginstal atau akses via cloud storage internal.
2. Sinkronisasikan folder lokal dokumen ASN Anda ke repositori RANTANG.
3. Jalankan pencarian semantik untuk menemukan berkas dinas masa lalu.',
  'https://rantang.parabot.internal',
  'https://github.com/bangkitberuang/rantang',
  'v2.1.0',
  'Windows & Web',
  '/icons/rantang.svg',
  'published',
  true,
  2,
  ARRAY['Node.js', 'Electron', 'SQLite', 'TypeScript'],
  '2026-02-10'
)
ON CONFLICT (id) DO NOTHING;

-- Karya 3 (Mobile App): SAWALA
INSERT INTO public.karya (
  id, slug, nama, tagline, jenis, kategori_id,
  deskripsi, cara_penggunaan, url_utama, url_repositori,
  versi, platform, ikon_url, status, unggulan, urutan, teknologi, tanggal_rilis
)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'sawala-sentimen-warga',
  'SAWALA Mobile',
  'Aplikasi Mobile Aspirasi Warga & Monitoring Keluhan Wilayah',
  'mobile',
  'c1000000-0000-0000-0000-000000000003',
  'Aplikasi mobile untuk warga dan petugas lapangan dalam menyampaikan aduan, memantau respons aspirasi secara real-time, serta pelacakan titik lokasi langsung dari smartphone.',
  '1. Pasang aplikasi APK di smartphone Android atau instal melalui TestFlight iOS.
2. Masuk menggunakan akun terverifikasi dan izinkan akses lokasi GPS.
3. Laporkan aspirasi atau pantau respons petugas wilayah Anda secara langsung.',
  'https://sawala.parabot.internal',
  'https://github.com/bangkitberuang/sawala-mobile',
  'v1.2.0',
  'Android & iOS (Flutter)',
  '/icons/sawala.svg',
  'published',
  false,
  3,
  ARRAY['Flutter', 'Dart', 'FastAPI', 'PostgreSQL'],
  '2026-03-01'
)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  tagline = EXCLUDED.tagline,
  jenis = EXCLUDED.jenis,
  deskripsi = EXCLUDED.deskripsi,
  cara_penggunaan = EXCLUDED.cara_penggunaan,
  platform = EXCLUDED.platform,
  teknologi = EXCLUDED.teknologi;

-- Karya 4 (DIY): BOT NOTULENSI MANDIRI
INSERT INTO public.karya (
  id, slug, nama, tagline, jenis, kategori_id,
  deskripsi, cara_penggunaan, url_utama, url_repositori,
  versi, platform, ikon_url, status, unggulan, urutan, teknologi, tanggal_rilis,
  tingkat_kesulitan, estimasi_waktu, bahan_alat
)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'diy-bot-notulensi-mandiri',
  'Bot Notulensi Suara Rapat Otomatis (DIY)',
  'Panduan Merakit Sistem Transkripsi Rapat Mandiri & Privat',
  'diy',
  'c1000000-0000-0000-0000-000000000003',
  'Proyek rekayasa mandiri (DIY) untuk membangun alat perekam dan perangkum notulensi rapat otomatis berbasis model AI lokal tanpa mengirimkan audio rahasia ke cloud luar.',
  '1. Siapkan perangkat mikrofon USB dan PC dengan RAM minimal 16GB.
2. Pasang library Python Whisper dan skrip automasi dari repositori.
3. Jalankan bot saat rapat berlangsung dan tunggu ringkasan Markdown tersusun rapi.',
  NULL,
  'https://github.com/bangkitberuang/diy-bot-notulensi',
  'v1.0.0',
  'Python CLI',
  '/icons/bot-diy.svg',
  'published',
  false,
  4,
  ARRAY['Python', 'Whisper AI', 'FFmpeg', 'Docker'],
  '2026-03-20',
  'Menengah',
  '2 Jam',
  '[
    {"nama": "PC / Laptop RAM 16GB", "keterangan": "Untuk menjalankan model AI lokal"},
    {"nama": "Mikrofon USB Eksternal", "keterangan": "Agar tangkapan suara ruang rapat jernih"},
    {"nama": "Docker & Python 3.11", "keterangan": "Lingkungan runtime terisolasi"}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Karya 5 (DIY): DASHBOARD IOT LINGKUNGAN RUANG SERVER
INSERT INTO public.karya (
  id, slug, nama, tagline, jenis, kategori_id,
  deskripsi, cara_penggunaan, url_utama, url_repositori,
  versi, platform, ikon_url, status, unggulan, urutan, teknologi, tanggal_rilis,
  tingkat_kesulitan, estimasi_waktu, bahan_alat
)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  'diy-iot-monitor-server',
  'Monitor Suhu & Kelembapan Server Mandiri (DIY)',
  'Alat IoT Hemat Biaya Pemantau Fisik Ruang Komputer',
  'diy',
  'c1000000-0000-0000-0000-000000000003',
  'Panduan merakit modul IoT mikrokontroler dengan sensor suhu DHT22 yang mengirimkan notifikasi peringatan suhu panas langsung ke bot Telegram admin.',
  '1. Rangkai mikrokontroler ESP32 bersama modul sensor DHT22.
2. Flash kode program Arduino / MicroPython yang disediakan.
3. Masukkan token bot Telegram Anda dan pasang alat di rak server.',
  NULL,
  'https://github.com/bangkitberuang/diy-server-monitor',
  'v1.2.0',
  'ESP32 Hardware',
  '/icons/iot-diy.svg',
  'published',
  false,
  5,
  ARRAY['ESP32', 'C++', 'MQTT', 'Telegram Bot API'],
  '2026-04-05',
  'Lanjutan',
  '3 Jam',
  '[
    {"nama": "Modul ESP32 NodeMCU", "keterangan": "Unit pemroses IoT dengan WiFi"},
    {"nama": "Sensor DHT22", "keterangan": "Sensor temperatur dan kelembaban akurat"},
    {"nama": "Kabel Jumper & Breadboard", "keterangan": "Untuk perakitan tanpa solder"},
    {"nama": "Adaptor USB 5V", "keterangan": "Sumber daya listrik kontinu"}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Unduhan untuk RANTANG
INSERT INTO public.karya_unduhan (
  id, karya_id, label, platform, url_drive, ukuran_teks, urutan, jumlah_klik
)
VALUES
  (
    'a2000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'RANTANG Desktop Installer (x64)',
    'windows',
    'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
    '48 MB',
    1,
    0
  ),
  (
    'a2000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    'Buku Panduan Instalasi & Format Berkas PDF',
    'berkas',
    'https://drive.google.com/file/d/1Z9Y8X7W6V5U4T3S2R1Q/view',
    '2.4 MB',
    2,
    0
  )
ON CONFLICT (id) DO NOTHING;

-- Screenshots untuk KARSA, RANTANG, SAWALA, dan DIY (2 gambar per karya)
INSERT INTO public.karya_screenshot (
  id, karya_id, url, keterangan, urutan
)
VALUES
  -- 1. KARSA
  (
    'a3000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    '/mockups/karsa-desktop.png',
    'desktop',
    1
  ),
  (
    'a3000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    '/mockups/karsa-mobile.png',
    'mobile',
    2
  ),
  -- 2. RANTANG
  (
    'a3000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    '/mockups/rantang-desktop.png',
    'desktop',
    1
  ),
  (
    'a3000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    '/mockups/rantang-mobile.png',
    'mobile',
    2
  ),
  -- 3. SAWALA
  (
    'a3000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000003',
    '/mockups/sawala-desktop.png',
    'desktop',
    1
  ),
  (
    'a3000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000003',
    '/mockups/sawala-mobile.png',
    'mobile',
    2
  ),
  -- 4. DIY BOT NOTULENSI
  (
    'a3000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000004',
    '/mockups/diy-bot-desktop.png',
    'desktop',
    1
  ),
  (
    'a3000000-0000-0000-0000-000000000008',
    'a1000000-0000-0000-0000-000000000004',
    '/mockups/diy-bot-mobile.png',
    'mobile',
    2
  ),
  -- 5. DIY IOT MONITOR SERVER
  (
    'a3000000-0000-0000-0000-000000000009',
    'a1000000-0000-0000-0000-000000000005',
    '/mockups/diy-iot-desktop.png',
    'desktop',
    1
  ),
  (
    'a3000000-0000-0000-0000-000000000010',
    'a1000000-0000-0000-0000-000000000005',
    '/mockups/diy-iot-mobile.png',
    'mobile',
    2
  )
ON CONFLICT (id) DO UPDATE SET
  karya_id = EXCLUDED.karya_id,
  url = EXCLUDED.url,
  keterangan = EXCLUDED.keterangan,
  urutan = EXCLUDED.urutan;

