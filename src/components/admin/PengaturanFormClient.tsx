'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import {
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Palette,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
} from 'lucide-react';

interface PengaturanFormProps {
  initialData: Record<string, unknown>;
}

export default function PengaturanFormClient({ initialData }: PengaturanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_brand: (initialData.nama_brand as string) || 'PARABOT',
    tagline_brand: (initialData.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev',
    logo_url: (initialData.logo_url as string) || '',
    warna_aksen: (initialData.warna_aksen as string) || '#10B981',
    kontak_whatsapp: (initialData.kontak_whatsapp as string) || '6281234567890',
    kontak_email: (initialData.kontak_email as string) || 'halo@parabot.id',
    teks_footer: (initialData.teks_footer as string) || 'Koleksi aplikasi dan dokumentasi digital mandiri oleh Bangkit Beruang Dev.',
    disclaimer: (initialData.disclaimer as string) || '© 2026 PARABOT. Dibangun dengan rasa ingin tahu dan dedikasi belajar.',

    // Teks Hero Utama
    hero_badge: (initialData.hero_badge as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev',
    hero_judul: (initialData.hero_judul as string) || 'Karya digital dari seorang ASN yang terus belajar.',
    hero_subjudul: (initialData.hero_subjudul as string) || 'Saya seorang pranata humas yang mencintai teknologi dan belajar menjadi developer—merancang aplikasi sederhana, alat bantu kerja, dan dokumentasi terbuka untuk mendukung tugas sehari-hari.',

    // Tombol Aksi Hero
    hero_tombol_utama_teks: (initialData.hero_tombol_utama as { teks?: string })?.teks || 'Lihat Koleksi Karya',
    hero_tombol_utama_href: (initialData.hero_tombol_utama as { href?: string })?.href || '/#katalog',
    hero_tombol_kedua_teks: (initialData.hero_tombol_kedua as { teks?: string })?.teks || 'Pelajari Fitur',
    hero_tombol_kedua_href: (initialData.hero_tombol_kedua as { href?: string })?.href || '/#keunggulan',

    // Kustomisasi Banner Hero (Atas)
    hero_banner_url: (initialData.hero_banner_url as string) || '/gedung-sate-angle.png',
    hero_banner_posisi: (initialData.hero_banner_posisi as string) || 'center 85%',
    hero_banner_opacity: (initialData.hero_banner_opacity as number) ?? 60,

    // Kustomisasi Banner Footer (Bawah) - Kanan/Kiri/Atas/Bawah
    footer_banner_url: (initialData.footer_banner_url as string) || '/gedung-sate-wide.png',
    footer_banner_posisi: (initialData.footer_banner_posisi as string) || 'center top',
    footer_banner_opacity: (initialData.footer_banner_opacity as number) ?? 60,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'logo_url' | 'hero_banner_url' | 'footer_banner_url',
    folder: string = 'logos'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetField === 'logo_url') setUploadingLogo(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal mengunggah gambar');
      }

      handleChange(targetField, json.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah file';
      setError(msg);
    } finally {
      if (targetField === 'logo_url') setUploadingLogo(false);
      // Reset input value agar bisa pilih file yang sama jika perlu
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const {
        hero_tombol_utama_teks,
        hero_tombol_utama_href,
        hero_tombol_kedua_teks,
        hero_tombol_kedua_href,
        ...restFormData
      } = formData;

      const payload = {
        ...restFormData,
        hero_tombol_utama: {
          teks: hero_tombol_utama_teks,
          href: hero_tombol_utama_href,
        },
        hero_tombol_kedua: {
          teks: hero_tombol_kedua_teks,
          href: hero_tombol_kedua_href,
        },
      };

      const res = await fetch('/api/admin/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pengaturan: payload }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menyimpan pengaturan');
      }

      setSuccess(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav currentPath="/admin/pengaturan" />

      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Sliders className="w-7 h-7 text-emerald-600" />
              <span>Pengaturan Situs & Kustomisasi Banner</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Atur posisi banner (kanan/kiri/atas/bawah), tingkat opasitas, warna brand, dan nomor WhatsApp.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {saving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Pengaturan berhasil diperbarui dan diterapkan langsung ke situs publik!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* =========================================================================
              1. KUSTOMISASI BANNER FOOTER (BAWAH) - KANAN/KIRI/ATAS/BAWAH
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Kustomisasi Banner Footer (Bawah)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Gambar Banner Footer
                </label>
                <input
                  type="text"
                  value={formData.footer_banner_url}
                  onChange={(e) => handleChange('footer_banner_url', e.target.value)}
                  placeholder="/gedung-sate-wide.png"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Path gambar di folder public atau link URL lengkap.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Posisi Gambar Footer (Perataan Kiri - Tengah - Kanan & Atas - Tengah - Bawah)
                </label>
                
                {/* 9-Point Alignment Grid */}
                <div className="grid grid-cols-3 gap-2 max-w-md mb-3">
                  {[
                    { label: '↖ Kiri Atas', val: 'left top' },
                    { label: '↑ Atas Tengah', val: 'center top' },
                    { label: '↗ Kanan Atas', val: 'right top' },
                    { label: '← Kiri Tengah', val: 'left center' },
                    { label: '• Tengah Pas', val: 'center center' },
                    { label: '→ Kanan Tengah', val: 'right center' },
                    { label: '↙ Kiri Bawah', val: 'left bottom' },
                    { label: '↓ Bawah Tengah', val: 'center bottom' },
                    { label: '↘ Kanan Bawah', val: 'right bottom' },
                  ].map((pos) => (
                    <button
                      key={pos.val}
                      type="button"
                      onClick={() => handleChange('footer_banner_posisi', pos.val)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                        formData.footer_banner_posisi === pos.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Atau Nilai Kustom (CSS/Persen):</span>
                  <input
                    type="text"
                    value={formData.footer_banner_posisi}
                    onChange={(e) => handleChange('footer_banner_posisi', e.target.value)}
                    placeholder="misal: 50% 20% atau center top"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih tombol arah cepat di atas atau masukkan koordinat persen bebas (misal: <code className="text-emerald-700 font-mono">center 15%</code> atau <code className="text-emerald-700 font-mono">center top</code>) agar proporsi gambar footer gedung sate pas dan tidak terpotong.
                </p>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Opasitas Banner Footer ({formData.footer_banner_opacity}%)
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {formData.footer_banner_opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.footer_banner_opacity}
                  onChange={(e) => handleChange('footer_banner_opacity', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Transparan)</span>
                  <span>50% (Sedang)</span>
                  <span>100% (Sangat Jelas)</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              KONTEN TEKS HERO UTAMA (Judul Besar, Sub-judul & Badge)
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Teks Hero Utama (Tampilan Atas Halaman)
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Teks Badge Melayang di Atas Judul
                </label>
                <input
                  type="text"
                  value={formData.hero_badge}
                  onChange={(e) => handleChange('hero_badge', e.target.value)}
                  placeholder="Portofolio Karya Digital · Bangkit Beruang Dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pil badge kecil dengan ikon bintang di atas judul besar beranda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Judul Utama Hero (Heading 1)
                </label>
                <textarea
                  rows={2}
                  value={formData.hero_judul}
                  onChange={(e) => handleChange('hero_judul', e.target.value)}
                  placeholder="Karya digital dari seorang ASN yang terus belajar."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-snug"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Kalimat pembuka utama berukuran besar di bagian tengah layar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sub-judul / Paragraf Pengantar Hero
                </label>
                <textarea
                  rows={3}
                  value={formData.hero_subjudul}
                  onChange={(e) => handleChange('hero_subjudul', e.target.value)}
                  placeholder="Saya seorang pranata humas yang mencintai teknologi dan belajar menjadi developer..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Paragraf penjelasan di bawah judul utama yang menjelaskan profil atau tujuan situs.
                </p>
              </div>

              {/* Pengaturan Tombol Aksi Hero */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Teks Tombol Hero Utama
                    </label>
                    <input
                      type="text"
                      value={formData.hero_tombol_utama_teks}
                      onChange={(e) => handleChange('hero_tombol_utama_teks', e.target.value)}
                      placeholder="Lihat Koleksi Karya"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tautan/URL Tombol Utama
                    </label>
                    <input
                      type="text"
                      value={formData.hero_tombol_utama_href}
                      onChange={(e) => handleChange('hero_tombol_utama_href', e.target.value)}
                      placeholder="/#katalog"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Teks Tombol Hero Kedua
                    </label>
                    <input
                      type="text"
                      value={formData.hero_tombol_kedua_teks}
                      onChange={(e) => handleChange('hero_tombol_kedua_teks', e.target.value)}
                      placeholder="Pelajari Fitur / Tentang PARABOT"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tautan/URL Tombol Kedua
                    </label>
                    <input
                      type="text"
                      value={formData.hero_tombol_kedua_href}
                      onChange={(e) => handleChange('hero_tombol_kedua_href', e.target.value)}
                      placeholder="/#keunggulan atau /tentang"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Gunakan <code>/#keunggulan</code> untuk meluncur ke fitur/prinsip kerja, atau <code>/tentang</code> untuk ke halaman Tentang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. KUSTOMISASI BANNER HERO (ATAS)
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Kustomisasi Banner Hero (Atas)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Gambar Banner Hero
                </label>
                <input
                  type="text"
                  value={formData.hero_banner_url}
                  onChange={(e) => handleChange('hero_banner_url', e.target.value)}
                  placeholder="/gedung-sate-angle.png"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Posisi Latar Hero (Atas - Tengah - Bawah & Kiri - Tengah - Kanan)
                </label>
                
                {/* 9-Point Alignment Grid Hero */}
                <div className="grid grid-cols-3 gap-2 max-w-md mb-3">
                  {[
                    { label: '↖ Kiri Atas', val: 'left top' },
                    { label: '↑ Atas Tengah', val: 'center top' },
                    { label: '↗ Kanan Atas', val: 'right top' },
                    { label: '← Kiri Tengah', val: 'left center' },
                    { label: '• Tengah Pas', val: 'center center' },
                    { label: '→ Kanan Tengah', val: 'right center' },
                    { label: '↙ Kiri Bawah', val: 'left bottom' },
                    { label: '↓ Bawah Tengah', val: 'center bottom' },
                    { label: '🎯 Posisi Ideal', val: 'center 85%' },
                  ].map((pos) => (
                    <button
                      key={pos.val}
                      type="button"
                      onClick={() => handleChange('hero_banner_posisi', pos.val)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                        formData.hero_banner_posisi === pos.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Atau Nilai Kustom:</span>
                  <input
                    type="text"
                    value={formData.hero_banner_posisi}
                    onChange={(e) => handleChange('hero_banner_posisi', e.target.value)}
                    placeholder="misal: center 85% atau center bottom"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih tombol cepat di atas atau masukkan koordinat (misal: <code className="text-emerald-700 font-mono">center 85%</code>) agar siluet Gedung Sate pas di belakang mockup laptop & HP.
                </p>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Opasitas Banner Hero ({formData.hero_banner_opacity}%)
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {formData.hero_banner_opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.hero_banner_opacity}
                  onChange={(e) => handleChange('hero_banner_opacity', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. IDENTITAS BRAND & WARNA AKSEN
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Palette className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Brand, Tagline & Warna Aksen
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Brand
                </label>
                <input
                  type="text"
                  value={formData.nama_brand}
                  onChange={(e) => handleChange('nama_brand', e.target.value)}
                  placeholder="PARABOT"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Warna Aksen Utama (Hex)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.warna_aksen}
                    onChange={(e) => handleChange('warna_aksen', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={formData.warna_aksen}
                    onChange={(e) => handleChange('warna_aksen', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sub-judul / Tagline Brand (di bawah logo navbar)
                </label>
                <input
                  type="text"
                  value={formData.tagline_brand}
                  onChange={(e) => handleChange('tagline_brand', e.target.value)}
                  placeholder="Portofolio Karya Digital · Bangkit Beruang Dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Teks subtitle kecil yang tampil tepat di bawah nama brand di pojok kiri atas navbar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Logo Brand (Upload File atau URL)
                </label>
                
                {/* File Upload Box */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <label className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 cursor-pointer transition shadow-sm">
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span>Pilih Gambar dari Komputer</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      disabled={uploadingLogo}
                      onChange={(e) => handleFileUpload(e, 'logo_url', 'logos')}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-400 font-medium">atau ketik link:</span>

                  <input
                    type="text"
                    value={formData.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    placeholder="misal: /logo.svg atau https://..."
                    className="flex-1 w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />

                  {formData.logo_url && (
                    <div className="relative group w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => handleChange('logo_url', '')}
                        title="Hapus logo"
                        className="absolute inset-0 bg-rose-600/90 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  Format: PNG, JPG, WEBP, atau SVG. Jika dikosongkan, navbar menampilkan ikon kode standar `&lt;/&gt;`.
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              4. KONTAK & FLOATING WHATSAPP
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Phone className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Nomor WhatsApp & Kontak Korespondensi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nomor WhatsApp (Tombol Float)
                </label>
                <input
                  type="text"
                  value={formData.kontak_whatsapp}
                  onChange={(e) => handleChange('kontak_whatsapp', e.target.value)}
                  placeholder="6281234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Dapat diisi awalan 08 atau 628. Kosongkan jika ingin menyembunyikan tombol floating WA.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Korespondensi
                </label>
                <input
                  type="email"
                  value={formData.kontak_email}
                  onChange={(e) => handleChange('kontak_email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              5. TEKS FOOTER & DISCLAIMER
              ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Teks Footer & Hak Cipta
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deskripsi Footer
                </label>
                <textarea
                  rows={2}
                  value={formData.teks_footer}
                  onChange={(e) => handleChange('teks_footer', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Teks Disclaimer / Hak Cipta
                </label>
                <input
                  type="text"
                  value={formData.disclaimer}
                  onChange={(e) => handleChange('disclaimer', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan Bawah */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
            >
              {saving ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
