import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import HalamanFormClient from '@/components/admin/HalamanFormClient';

export const metadata = {
  title: 'Kelola Halaman Statis | Admin PARABOT',
};

export const dynamic = 'force-dynamic';

export default async function AdminHalamanPage() {
  const supabase = await createClient();

  // Ambil data halaman 'tentang' dari tabel halaman_statis
  const { data: halamanData } = await supabase
    .from('halaman_statis')
    .select('id, slug, judul, isi, tampil')
    .eq('slug', 'tentang')
    .maybeSingle();

  // Ambil pengaturan situs untuk banner halaman tentang
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bannerSettings } = await (supabase.from('pengaturan_situs') as any)
    .select('kunci, nilai')
    .in('kunci', ['tentang_banner_url', 'tentang_banner_posisi', 'tentang_banner_opacity']);

  let bannerUrl = '';
  let bannerPosisi = 'center center';
  let bannerOpacity = 60;

  if (bannerSettings) {
    for (const item of bannerSettings) {
      try {
        const val = typeof item.nilai === 'string' && item.nilai.startsWith('"')
          ? JSON.parse(item.nilai)
          : item.nilai;
        if (item.kunci === 'tentang_banner_url') bannerUrl = String(val || '');
        if (item.kunci === 'tentang_banner_posisi') bannerPosisi = String(val || 'center center');
        if (item.kunci === 'tentang_banner_opacity') bannerOpacity = Number(val) || 60;
      } catch {
        // fallback
      }
    }
  }

  const initialHalaman = {
    ...(halamanData || {
      slug: 'tentang',
      judul: 'Tentang PARABOT',
      isi: `PARABOT adalah etalase dan studio produk digital mandiri yang dirancang oleh Bangkit Beruang Dev.

## Mengapa PARABOT Dibangun?
Proyek ini lahir dari keinginan menyederhanakan alur birokrasi dan administrasi dokumen kehumasan yang repetitif melalui piranti digital yang praktis, cepat, dan rapi.

## Filosofi Pengembangan
1. **Solusi Nyata**: Fokus pada alat bantu yang langsung menjawab kebutuhan di lapangan.
2. **Kemandirian**: Dibangun dari rasa ingin tahu, eksperimen mandiri, dan semangat belajar berkelanjutan.
3. **Dokumentasi Terbuka**: Setiap modul dan alur kerja didokumentasikan agar dapat dipelajari dan dikembangkan lebih lanjut.`,
      tampil: true,
    }),
    banner_url: bannerUrl,
    banner_posisi: bannerPosisi,
    banner_opacity: bannerOpacity,
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin/halaman" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-6xl">
        <HalamanFormClient initialHalaman={initialHalaman} />
      </main>
    </div>
  );
}
