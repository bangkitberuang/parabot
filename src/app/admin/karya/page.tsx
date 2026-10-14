import React from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/server';
import {
  Plus,
  ExternalLink,
  Edit,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';

export const metadata = {
  title: 'Kelola Karya | Admin PARABOT',
};

export const dynamic = 'force-dynamic';

interface KaryaRow {
  id: string;
  nama: string;
  slug: string;
  jenis: string;
  status: string;
  unggulan: boolean;
  urutan: number;
  diperbarui_pada: string;
  kategori?: { nama: string } | null;
}

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

        {/* Tabel Karya */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-6">Urutan</th>
                  <th className="py-3.5 px-6">Nama Karya</th>
                  <th className="py-3.5 px-6">Jenis</th>
                  <th className="py-3.5 px-6">Kategori</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Unggulan</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Belum ada karya yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-mono font-bold text-slate-400">
                        #{item.urutan}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{item.nama}</div>
                        <div className="text-[11px] font-mono text-slate-400">/karya/{item.slug}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {item.jenis}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {item.kategori?.nama || '-'}
                      </td>
                      <td className="py-4 px-6">
                        {item.status === 'published' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Eye className="w-3 h-3" />
                            <span>Publik</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <EyeOff className="w-3 h-3" />
                            <span>Disembunyikan</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {item.unggulan ? (
                          <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>Ya</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 font-medium">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/karya/${item.slug}`}
                            target="_blank"
                            title="Buka halaman publik"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/karya/${item.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
