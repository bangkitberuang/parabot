'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface HalamanData {
  id?: string;
  slug: string;
  judul: string;
  isi: string;
  tampil: boolean;
  banner_url?: string;
  banner_posisi?: string;
  banner_opacity?: number;
}

interface HalamanFormProps {
  initialHalaman: HalamanData;
}

export default function HalamanFormClient({ initialHalaman }: HalamanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<HalamanData>({
    ...initialHalaman,
    banner_url: initialHalaman.banner_url || '',
    banner_posisi: initialHalaman.banner_posisi || 'center center',
    banner_opacity: initialHalaman.banner_opacity ?? 60,
  });
  const [prevInitialHalaman, setPrevInitialHalaman] = useState(initialHalaman);

  if (initialHalaman !== prevInitialHalaman) {
    setPrevInitialHalaman(initialHalaman);
    setFormData({
      ...initialHalaman,
      banner_url: initialHalaman.banner_url || '',
      banner_posisi: initialHalaman.banner_posisi || 'center center',
      banner_opacity: initialHalaman.banner_opacity ?? 60,
    });
  }

  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof HalamanData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'banners');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal mengunggah banner');
      }

      handleChange('banner_url', json.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah banner';
      setError(msg);
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/halaman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menyimpan halaman');
      }

      setSuccess(true);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kelola Halaman: {formData.judul}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sunting teks judul, paragraf penjelasan, dan status publikasi halaman Tentang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tentang"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
          >
            <span>Lihat Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Halaman Tentang berhasil diperbarui! Perubahan langsung tampil di `/tentang`.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Editor Konten (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Judul Halaman *
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => handleChange('judul', e.target.value)}
                placeholder="Tentang PARABOT"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Isi Konten Halaman (Rich Text / WYSIWYG Editor)
                </label>
              </div>

              <RichTextEditor
                value={formData.isi}
                onChange={(val) => handleChange('isi', val)}
                placeholder="Tuliskan kisah, visi, profil pembuat, atau panduan kerja..."
              />
            </div>
          </div>
          {/* Card Banner Halaman Tentang */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Banner Latar Header Halaman Tentang
                </h2>
              </div>

              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 cursor-pointer transition shadow-sm">
                {uploadingBanner ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Banner dari Komputer</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploadingBanner}
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>

            {formData.banner_url ? (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 h-40 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.banner_url}
                  alt="Banner Tentang"
                  className="w-full h-full object-cover transition duration-300"
                  style={{
                    objectPosition: formData.banner_posisi || 'center center',
                    opacity: (formData.banner_opacity ?? 60) / 100,
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleChange('banner_url', '')}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-lg hover:bg-rose-700 transition"
                  title="Hapus banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500 font-medium">Belum ada banner latar khusus (menggunakan gradasi hijau emerald bawaan).</p>
                <p className="text-[11px] text-slate-400 mt-1">Upload gambar gedung sate, foto profil, atau ilustrasi lanskap yang Anda sukai.</p>
              </div>
            )}

            {formData.banner_url && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Posisi Perataan Banner (Kiri - Tengah - Kanan & Atas - Tengah - Bawah)
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2 max-w-sm mb-2">
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
                        onClick={() => handleChange('banner_posisi', pos.val)}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          formData.banner_posisi === pos.val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={formData.banner_posisi || ''}
                    onChange={(e) => handleChange('banner_posisi', e.target.value)}
                    placeholder="misal: center center atau 50% 20%"
                    className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Opasitas Banner Latar ({formData.banner_opacity ?? 60}%)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {formData.banner_opacity ?? 60}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.banner_opacity ?? 60}
                    onChange={(e) => handleChange('banner_opacity', Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Visibilitas & Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Pengaturan Tampil
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status Halaman
              </label>
              <select
                value={formData.tampil ? 'true' : 'false'}
                onChange={(e) => handleChange('tampil', e.target.value === 'true')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="true">Aktif & Tampil ke Publik</option>
                <option value="false">Sembunyikan (Private)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                URL Akses
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                /tentang
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-100 p-5 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Pratinjau Langsung</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800/80">
              Setelah Anda menekan <strong>Simpan Perubahan</strong>, sistem langsung memperbarui halaman publik di <code>/tentang</code> tanpa jeda build.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
