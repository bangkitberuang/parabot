# TODO & Rencana Tindak Lanjut PARABOT

Daftar temuan dan tugas lanjutan yang diurutkan berdasarkan skala prioritas (paling penting):

---

### [PRIORITAS TINGGI]
1. **[SELESAI] Implementasi TAHAP 3: Panel Admin Lengkap (`/admin`)**
   - **Autentikasi Supabase Auth:** Halaman login email/password untuk admin dengan proteksi session cookie HttpOnly via Next.js 16 Proxy (`proxy.ts`).
   - **Otorisasi Ketat:** Memastikan hanya akun dengan email yang terdaftar di tabel `admin_email` yang dapat mengakses rute `/admin/*` (pengguna anon atau non-admin di-redirect ke login/ditolak 403).
   - **Dasbor Statistik Nyata:** Kartu ringkasan jumlah karya per status (`published`, `hidden`, `draft`), total klik unduhan riil, dan 5 karya terakhir diperbarui.
   - **Kelola Karya:** Tabel dengan filter jenis/kategori, toggle cepat Published/Hidden, tombol Edit, Duplikat, Hapus (konfirmasi), serta drag-and-drop urutan.
   - **Formulir Karya Dinamis & Validasi Zod:** Field adaptif sesuai jenis (`web`, `unduhan`, `diy`), Markdown Editor dengan pratinjau langsung, upload screenshot/ikon ke bucket `aset-parabot`, repeater unduhan link Google Drive, serta field DIY (kesulitan, waktu, bahan & alat).
   - **Kelola Kategori, Pengaturan Situs, Menu Navigasi, Bagian Beranda, dan Halaman Statis:** Form terkelompok dengan integrasi pemanggilan webhook `/api/revalidate` otomatis setelah simpan.
   - **Desain Panel Admin Ramah Mobile:** Tampilan responsif dengan card view di layar HP dan target tap tombol minimal 44px.
   - **Kesesuaian Next.js 16 & TypeScript:** Migrasi dari konvensi middleware usang ke `src/proxy.ts`, penambahan relasi `GenericSchema` Supabase, serta zero lint & build errors.

---

### [PRIORITAS MENENGAH]
2. **Kredensial Rahasia Produksi & Variabel Lingkungan**
   - Dapatkan `SUPABASE_SERVICE_ROLE_KEY` dari dashboard Supabase untuk disimpan di Vercel Environment Variables (agar endpoint `/api/revalidate` terproteksi penuh).
   - Daftarkan email admin di tabel `admin_email` melalui SQL Editor Supabase untuk user admin pertama.

3. **Penyempurnaan Tampilan Gambar Mockup Publik**
   - Mengganti screenshot mockup placeholder di halaman detail karya dengan berkas gambar aktual via `next/image` setelah panel admin aktif untuk mengunggah aset ke Supabase Storage.

---

### [PRIORITAS RENDAH]
4. **Rate Limiting Endpoint Autentikasi**
   - Menambahkan pembatasan percobaan login (rate limiter) pada rute login admin sebelum peluncuran publik skala penuh.

5. **Pembersihan Data Demo untuk Produksi**
   - Menyediakan skrip terpisah untuk me-reset data seed contoh saat situs resmi dirilis ke publik.
