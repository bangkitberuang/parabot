import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import KaryaFormClient from '@/components/admin/KaryaFormClient';

export const metadata = {
  title: 'Tambah Karya Baru | Admin PARABOT',
};

export const dynamic = 'force-dynamic';

export default async function TambahKaryaPage() {
  const supabase = await createClient();

  // Ambil daftar kategori aktif
  const { data: kategoriData } = await supabase
    .from('kategori')
    .select('id, nama')
    .eq('aktif', true)
    .order('urutan', { ascending: true });

  const kategoriList = (kategoriData as Array<{ id: string; nama: string }>) || [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin/karya" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-6xl">
        <KaryaFormClient kategoriList={kategoriList} isEdit={false} />
      </main>
    </div>
  );
}
