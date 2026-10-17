<div align="center">
  <img src="public/logo.png" alt="PARABOT Logo" width="160" height="160" style="border-radius: 24px;" />
  <h1>PARABOT</h1>
  <p><strong>Parabot Digital, Karya Nyata.</strong></p>
  <p><em>Etalase dan studio produk digital mandiri oleh Bangkit Beruang Dev yang dirancang untuk mendukung operasional kerja sehari-hari.</em></p>

  <p>
    <a href="https://parabot-coral.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-parabot--coral.vercel.app-10B981?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Next.js-16.4.0%20(Turbopack)-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 🌟 Tentang PARABOT

**PARABOT** adalah platform *showcase* portofolio aplikasi, arsip alat kerja, dan panduan rekayasa perangkat lunak mandiri (*Do-It-Yourself* / DIY). Dibangun dengan arsitektur modern Next.js 16 (App Router + Turbopack) serta backend Supabase PostgreSQL, platform ini memungkinkan pengelolaan konten secara dinamis melalui dashboard admin yang intuitif.

### ✨ Fitur Utama

- 🚀 **Katalog Karya Adaptif:** Filter karya berdasarkan jenis (*Web App*, *Mobile App*, *Unduhan Aplikasi*, dan *Proyek DIY*).
- 🛠️ **Halaman Detail Interaktif:** Penjelasan teknis, stack teknologi, tangkapan layar multi-perangkat (desktop & mobile), panduan perakitan DIY (alat, bahan, tingkat kesulitan, estimasi waktu).
- 📥 **Pencatat Statistik Unduhan (RPC Aman):** Pelacak jumlah unduhan riil terintegrasi Google Drive via Supabase Security Definer RPC.
- 🎛️ **Panel Kontrol Admin Mandiri (`/admin`):**
  - Autentikasi sesi aman via Supabase Auth & HttpOnly Cookies.
  - Kelola karya, kategori, halaman statis, dan pengaturan situs (logo, tagline, warna aksen, banner).
  - Rich Text & Markdown Editor dengan pratinjau langsung yang terproteksi sanitasi XSS (`sanitize-html`).
- ⚡ **Kinerja Tinggi & SEO Maksimal:**
  - Dynamic OpenGraph metadata, JSON-LD, sitemap otomatis, dan robots.txt.
  - On-demand ISR (*Incremental Static Regeneration*) via endpoint `/api/revalidate`.
- 🌿 **Sentuhan Budaya Pasundan:** Estetika antarmuka memadukan nuansa modern dengan aksen *Tatar Pasundan* (*Silih Asah, Silih Asih, Silih Asuh*).

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Proxy Middleware) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15, RLS, Storage, Auth) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & `@tailwindcss/typography` |
| **Ikon** | [Lucide React](https://lucide.dev/) |
| **Markdown Parser** | [Marked](https://marked.js.org/) + [Sanitize-HTML](https://github.com/apostrophecms/sanitize-html) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## 🚀 Menjalankan Secara Lokal

### 1. Clone Repositori
```bash
git clone https://github.com/bangkitberuang/parabot.git
cd parabot
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env.local`)
Salin berkas `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Lalu lengkapi nilainya:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
ADMIN_EMAIL=bangkitberuang@gmail.com
```

### 4. Setup Database Supabase
Jalankan skrip migrasi dan seed yang tersedia di folder `supabase/`:
- `supabase/migrations/20261010000000_skema_dan_kebijakan_awal.sql`
- `supabase/seed.sql`

### 5. Jalankan Server Dev
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📦 Deployment ke Vercel

Aplikasi ini sudah dioptimalkan untuk Vercel:
1. Hubungkan repositori GitHub ini ke akun Vercel.
2. Tambahkan variabel lingkungan yang sama dari `.env.local` pada **Project Settings > Environment Variables**.
3. Deploy akan berjalan otomatis pada setiap commit ke branch `main`.

---

## 📄 Lisensi & Pembuat

Dibuat dengan rasa ingin tahu dan dedikasi belajar oleh **Bangkit Beruang Dev**.  
© 2026 **PARABOT**. Seluruh hak cipta dilindungi.
