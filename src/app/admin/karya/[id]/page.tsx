import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import KaryaFormClient from '@/components/admin/KaryaFormClient';

export const metadata = {
  title: 'Edit Karya | Admin PARABOT',
};

export const dynamic = 'force-dynamic';

export default async function EditKaryaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Ambil data karya
  const { data: karyaData, error } = await supabase
    .from('karya')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !karyaData) {
    notFound();
  }

  // 2. Ambil screenshots
  const { data: screenshotsData } = await supabase
    .from('karya_screenshot')
    .select('id, url, keterangan, urutan')
    .eq('karya_id', id)
    .order('urutan', { ascending: true });

  // 3. Ambil daftar kategori aktif
  const { data: kategoriData } = await supabase
    .from('kategori')
    .select('id, nama')
    .eq('aktif', true)
    .order('urutan', { ascending: true });

  const kategoriList = (kategoriData as Array<{ id: string; nama: string }>) || [];

  const initialData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(karyaData as any),
    screenshots: screenshotsData || [],
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin/karya" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-6xl">
        <KaryaFormClient
          initialData={initialData}
          kategoriList={kategoriList}
          isEdit={true}
        />
      </main>
    </div>
  );
}
