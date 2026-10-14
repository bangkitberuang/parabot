import React from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import {
  getKaryaPublikList,
  getKategoriAktif,
  getPengaturanSitus,
} from '@/lib/data/publik';
import { FolderGit2, Sliders, ArrowRight, Sparkles } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [karyaList, kategoriList, pengaturan] = await Promise.all([
    getKaryaPublikList(),
    getKategoriAktif(),
    getPengaturanSitus(),
  ]);

  const totalKarya = karyaList.length;
  const totalKategori = kategoriList.length;
  const karyaUnggulan = karyaList.find((k) => k.unggulan) || karyaList[0];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-6xl">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Kontrol PARABOT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola seluruh konten, karya digital, dan pengaturan tampilan situs publik.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pengaturan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan Banner & Warna</span>
            </Link>
            <Link
              href="/admin/karya/baru"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition"
            >
              <span>+ Tambah Karya Baru</span>
            </Link>
          </div>
        </div>

        {/* Ringkasan Angka Riil */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Karya Aktif
            </div>
            <div className="text-3xl font-black text-slate-900">{totalKarya}</div>
            <p className="text-[11px] text-slate-500 mt-1">Aplikasi Web, Unduhan, & Proyek DIY</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Kategori Terdaftar
            </div>
            <div className="text-3xl font-black text-emerald-700">{totalKategori}</div>
            <p className="text-[11px] text-slate-500 mt-1">Bidang pengelompokan karya publik</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Warna Aksen Aktif
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="w-8 h-8 rounded-xl border border-slate-200 shadow-inner"
                style={{ backgroundColor: (pengaturan.warna_aksen as string) || '#10B981' }}
              />
              <span className="font-mono text-xs font-bold text-slate-800">
                {(pengaturan.warna_aksen as string) || '#10B981'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Dapat diubah via menu Pengaturan</p>
          </div>
        </div>

        {/* Karya Unggulan Aktif Saat Ini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Karya Unggulan di Hero Banner
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Sedang Tampil
            </span>
          </div>

          {karyaUnggulan ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-slate-900">{karyaUnggulan.nama}</h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                  {karyaUnggulan.tagline || karyaUnggulan.deskripsi}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {karyaUnggulan.jenis}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {karyaUnggulan.versi}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/karya`}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Kelola di Daftar Karya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Belum ada karya yang ditandai unggulan.</p>
          )}
        </div>

        {/* Tautan Navigasi Cepat Pengaturan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/admin/pengaturan"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Kustomisasi Tampilan & Banner
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ubah posisi background banner (atas/bawah/kiri/kanan), atur opasitas, ganti nomor WhatsApp, dan warna brand.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/karya"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Kelola Daftar Karya
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tambah karya baru, perbarui versi, upload tangkapan layar desktop/mobile, dan atur visibilitas.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
