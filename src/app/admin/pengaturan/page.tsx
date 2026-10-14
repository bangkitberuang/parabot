import { Suspense } from 'react';
import { getPengaturanSitus } from '@/lib/data/publik';
import PengaturanFormClient from '@/components/admin/PengaturanFormClient';

export const metadata = {
  title: 'Pengaturan Situs | Admin PARABOT',
};

// Pastikan selalu ambil data terbaru dari database
export const dynamic = 'force-dynamic';

export default async function AdminPengaturanPage() {
  const data = await getPengaturanSitus();

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400">
          Memuat konfigurasi situs...
        </div>
      }
    >
      <PengaturanFormClient initialData={data} />
    </Suspense>
  );
}
