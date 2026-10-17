'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  UploadCloud,
  Loader2,
  Trash2,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video,
} from 'lucide-react';

interface KategoriOption {
  id: string;
  nama: string;
}

interface ScreenshotItem {
  id?: string;
  url: string;
  keterangan?: string;
}

interface KaryaFormData {
  id?: string;
  nama: string;
  slug: string;
  tagline: string;
  jenis: 'web' | 'mobile' | 'unduhan' | 'diy';
  kategori_id: string;
  deskripsi: string;
  cara_penggunaan: string;
  url_utama: string;
  url_repositori: string;
  youtube_title?: string;
  youtube_url?: string;
  versi: string;
  platform: string;
  status: 'published' | 'hidden' | 'draft';
  unggulan: boolean;
  urutan: number;
  tingkat_kesulitan: string;
  estimasi_waktu: string;
  teknologi: string[];
  screenshots: ScreenshotItem[];
}

interface KaryaFormProps {
  initialData?: Partial<KaryaFormData>;
  kategoriList: KategoriOption[];
  isEdit?: boolean;
}

export default function KaryaFormClient({
  initialData,
  kategoriList,
  isEdit = false,
}: KaryaFormProps) {
  const router = useRouter();

  const sanitizeInitialSlug = (slug?: string) => {
    if (!slug) return '';
    if (slug.startsWith('https') && slug.endsWith('kittlt')) {
      return slug.replace(/^https/i, '').replace(/kittlt$/i, '');
    }
    return slug;
  };

  const [formData, setFormData] = useState<KaryaFormData>({
    id: initialData?.id || '',
    nama: initialData?.nama || '',
    slug: sanitizeInitialSlug(initialData?.slug),
    tagline: initialData?.tagline || '',
    jenis: (initialData?.jenis as 'web' | 'mobile' | 'unduhan' | 'diy') || 'web',
    kategori_id: initialData?.kategori_id || '',
    deskripsi: initialData?.deskripsi || '',
    cara_penggunaan: initialData?.cara_penggunaan || '',
    url_utama: initialData?.url_utama || '',
    url_repositori: initialData?.url_repositori || '',
    youtube_title: initialData?.youtube_title || '',
    youtube_url: initialData?.youtube_url || '',
    versi: initialData?.versi || 'v1.0.0',
    platform: initialData?.platform || 'Web',
    status: (initialData?.status as 'published' | 'hidden' | 'draft') || 'published',
    unggulan: Boolean(initialData?.unggulan),
    urutan: initialData?.urutan ?? 0,
    tingkat_kesulitan: initialData?.tingkat_kesulitan || 'Menengah',
    estimasi_waktu: initialData?.estimasi_waktu || '1-2 jam',
    teknologi: initialData?.teknologi || ['Next.js', 'Tailwind CSS', 'TypeScript'],
    screenshots: initialData?.screenshots || [],
  });

  const [teknoInput, setTeknoInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // State Manajemen Kategori Interaktif
  const [kategoriState, setKategoriState] = useState<KategoriOption[]>(kategoriList);
  const [showKelolaKategori, setShowKelolaKategori] = useState(false);
  const [newKategoriNama, setNewKategoriNama] = useState('');
  const [loadingKategori, setLoadingKategori] = useState(false);

  const handleTambahKategori = async () => {
    if (!newKategoriNama.trim()) return;
    setLoadingKategori(true);
    try {
      const res = await fetch('/api/admin/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newKategoriNama.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menambah kategori');

      setKategoriState((prev) => [...prev, { id: json.data.id, nama: json.data.nama }]);
      // Pilih kategori yang baru dibuat
      setFormData((prev) => ({ ...prev, kategori_id: json.data.id }));
      setNewKategoriNama('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menambah kategori');
    } finally {
      setLoadingKategori(false);
    }
  };

  const handleHapusKategori = async (id: string, nama: string) => {
    if (!confirm(`Hapus kategori "${nama}"? Karya yang menggunakan kategori ini akan menjadi tanpa kategori.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/kategori?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menghapus kategori');

      setKategoriState((prev) => prev.filter((k) => k.id !== id));
      if (formData.kategori_id === id) {
        setFormData((prev) => ({ ...prev, kategori_id: '' }));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus kategori');
    }
  };

  const handleChange = (field: keyof KaryaFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  // Upload Screenshot / Thumbnail Langsung dari Komputer (Mendukung Multi-file Sekaligus)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const fileList = Array.from(files);
      const uploadPromises = fileList.map(async (file, fileIdx) => {
        const data = new FormData();
        data.append('file', file);
        data.append('folder', 'karya');

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: data,
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `Gagal mengunggah ${file.name}`);
        }

        return {
          url: json.url as string,
          keterangan: `Tangkapan Layar #${formData.screenshots.length + fileIdx + 1}`,
        };
      });

      const newScreenshots = await Promise.all(uploadPromises);

      // Tambahkan seluruh gambar ke daftar screenshots
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newScreenshots],
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah gambar';
      setError(msg);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const addTeknologi = () => {
    if (!teknoInput.trim()) return;
    if (!formData.teknologi.includes(teknoInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        teknologi: [...prev.teknologi, teknoInput.trim()],
      }));
    }
    setTeknoInput('');
  };

  const removeTeknologi = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      teknologi: prev.teknologi.filter((t) => t !== item),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const endpoint = isEdit ? `/api/admin/karya/${formData.id}` : '/api/admin/karya';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menyimpan karya');
      }

      setSuccess(true);
      router.push('/admin/karya');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/karya"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEdit ? `Edit Karya: ${formData.nama}` : 'Tambah Karya Baru'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi informasi detail, upload screenshot thumbnail, dan tentukan visibilitas karya.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/karya"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
          >
            Batal
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
                <span>Simpan Karya</span>
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
          <span>Karya berhasil disimpan dan cache halaman publik langsung diperbarui!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Informasi Utama & Media (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Dasar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Informasi Dasar Karya
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Karya *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Contoh: KARSA - Tata Kelola Arsip Humas"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Slug URL (Jalur Tautan di PARABOT)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 text-slate-500 text-xs rounded-l-xl font-mono select-none">
                    /karya/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      let val = e.target.value.trim();
                      if (/^https?:\/\//i.test(val)) {
                        try {
                          const url = new URL(val);
                          const segs = url.pathname.split('/').filter(Boolean);
                          val = segs.length > 0 ? segs[segs.length - 1] : url.hostname.split('.')[0];
                        } catch {
                          val = val.replace(/^https?:\/\//i, '');
                        }
                      }
                      if (val.startsWith('https') && val.endsWith('kittlt')) {
                        val = val.replace(/^https/i, '').replace(/kittlt$/i, '');
                      }
                      handleChange('slug', val);
                    }}
                    placeholder="galur"
                    className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  URL Halaman: <code className="text-emerald-700 font-semibold font-mono">/karya/{formData.slug || 'nama-karya'}</code>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  *Cukup masukkan kata pendek (misal: <strong>galur</strong>). Tautan situs web aplikasi dimasukkan di bagian <em>Tautan & Ekosistem</em> di bawah.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tagline Singkat
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Sistem arsip terstruktur dan penomoran surat"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Deskripsi Lengkap
              </label>
              <textarea
                rows={4}
                value={formData.deskripsi}
                onChange={(e) => handleChange('deskripsi', e.target.value)}
                placeholder="Jelaskan latar belakang, tujuan, dan fitur utama dari karya ini..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Panduan / Cara Penggunaan (Opsional)
              </label>
              <textarea
                rows={3}
                value={formData.cara_penggunaan}
                onChange={(e) => handleChange('cara_penggunaan', e.target.value)}
                placeholder="Langkah-langkah untuk mencoba atau menginstal aplikasi..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: Upload Thumbnail & Screenshots */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Thumbnail & Screenshots Aplikasi
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gambar pertama akan otomatis menjadi thumbnail kartu katalog & layar laptop di hero.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 cursor-pointer transition shadow-sm">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Mengunggah Gambar...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Upload Gambar (Bisa Banyak Sekaligus)</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* List Screenshots */}
            {formData.screenshots.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Belum ada screenshot yang diunggah</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Klik tombol hijau di atas untuk memilih gambar dari komputer Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.screenshots.map((s, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    <div className="w-full aspect-video relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.url}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 bg-white flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {idx === 0 ? '★ Thumbnail Utama' : `Screenshot #${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="p-1 rounded-md text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                        title="Hapus gambar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Link & Tautan Terkait */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Tautan & Ekosistem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Aplikasi Live / Demo
                </label>
                <input
                  type="text"
                  value={formData.url_utama}
                  onChange={(e) => handleChange('url_utama', e.target.value)}
                  placeholder="https://aplikasi-saya.vercel.app"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Repositori GitHub
                </label>
                <input
                  type="text"
                  value={formData.url_repositori}
                  onChange={(e) => handleChange('url_repositori', e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>Judul Video YouTube</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.youtube_title || ''}
                    onChange={(e) => handleChange('youtube_title', e.target.value)}
                    placeholder="Contoh: Video Tutorial Karsa"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>URL Video YouTube</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Opsional</span>
                  </div>
                  <input
                    type="text"
                    value={formData.youtube_url || ''}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                    placeholder="Contoh: https://youtu.be/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 sm:col-span-2">
                  Masukkan tautan video YouTube normal atau shorts. Sistem akan otomatis menyematkan pemutar video interaktif di halaman detail karya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Taksonomi, Unggulan & Status (1 Kolom) */}
        <div className="space-y-6">
          {/* Card Status & Unggulan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Visibilitas & Unggulan
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status Publikasi
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="published">Publik (Tampil di Situs)</option>
                <option value="hidden">Disembunyikan (Arsip Pribadi)</option>
                <option value="draft">Draft (Konsep)</option>
              </select>
            </div>

            {/* Toggle Karya Unggulan di Hero */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition">
                <input
                  type="checkbox"
                  checked={formData.unggulan}
                  onChange={(e) => handleChange('unggulan', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Jadikan Karya Unggulan di Hero</span>
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-0.5 leading-snug">
                    Jika dicentang, screenshot karya ini akan langsung muncul di bingkai Laptop & HP bagian Hero beranda.
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Urutan Tampil (Angka kecil tampil lebih atas)
              </label>
              <input
                type="number"
                value={formData.urutan}
                onChange={(e) => handleChange('urutan', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card Kategori & Jenis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Jenis & Kategori
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Jenis Karya
              </label>
              <select
                value={formData.jenis}
                onChange={(e) => handleChange('jenis', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="web">Web Application</option>
                <option value="mobile">Aplikasi Mobile (Android / iOS)</option>
                <option value="unduhan">Paket Unduhan / Desktop Software</option>
                <option value="diy">Proyek DIY / Rekayasa Mandiri</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kategori
                </label>
                <button
                  type="button"
                  onClick={() => setShowKelolaKategori(!showKelolaKategori)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showKelolaKategori ? 'Tutup Kelola' : '+ Tambah / Atur Kategori'}</span>
                </button>
              </div>

              {/* Panel Kelola & Tambah Kategori Cepat */}
              {showKelolaKategori && (
                <div className="p-3.5 mb-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nama kategori baru..."
                      value={newKategoriNama}
                      onChange={(e) => setNewKategoriNama(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTambahKategori();
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={loadingKategori || !newKategoriNama.trim()}
                      onClick={handleTambahKategori}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                    >
                      {loadingKategori ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      <span>Tambah</span>
                    </button>
                  </div>

                  {/* Daftar Kategori Aktif untuk Dihapus */}
                  {kategoriState.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Daftar Kategori Tersedia:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {kategoriState.map((kat) => (
                          <span
                            key={kat.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                          >
                            <span>{kat.nama}</span>
                            <button
                              type="button"
                              onClick={() => handleHapusKategori(kat.id, kat.nama)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                              title="Hapus kategori"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <select
                value={formData.kategori_id}
                onChange={(e) => handleChange('kategori_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="">-- Tanpa Kategori --</option>
                {kategoriState.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Versi Rilis
              </label>
              <input
                type="text"
                value={formData.versi}
                onChange={(e) => handleChange('versi', e.target.value)}
                placeholder="v1.0.0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card Tag Teknologi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Teknologi yang Digunakan
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={teknoInput}
                onChange={(e) => setTeknoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTeknologi();
                  }
                }}
                placeholder="misal: React, Python..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTeknologi}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.teknologi.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeTeknologi(item)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
