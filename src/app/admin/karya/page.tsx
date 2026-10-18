import React from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import KaryaTableClient, { KaryaRow } from '@/components/admin/KaryaTableClient';

export const metadata = {
  title: 'Kelola Karya | Admin PARABOT',
};

export const dynamic = 'force-dynamic';

export default async function AdminKaryaPage() {
  const supabase = await createClient();

  const { data: karyaData } = await supabase
    .from('karya')
    .select(`
      id,
      nama,
      slug,
      jenis,
      status,
      unggulan,
      urutan,
      diperbarui_pada,
      kategori:kategori_id (nama)
    `)
    .order('urutan', { ascending: true });

  const list: KaryaRow[] = (karyaData as unknown as KaryaRow[]) || [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin/karya" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Koleksi Karya Digital
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Atur daftar karya, status publikasi, urutan tampil, dan jadikan karya unggulan di halaman utama.
            </p>
          </div>

          <Link
            href="/admin/karya/baru"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Karya Baru</span>
          </Link>
        </div>

        {/* Tabel Interaktif Client dengan Fitur Pencarian & Hapus */}
        <KaryaTableClient initialList={list} />
      </main>
    </div>
  );
}

