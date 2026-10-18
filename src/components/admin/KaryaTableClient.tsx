'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export interface KaryaRow {
  id: string;
  nama: string;
  slug: string;
  jenis: string;
  status: string;
  unggulan: boolean;
  urutan: number;
  diperbarui_pada: string;
  ikon_url?: string | null;
  kategori?: { nama: string } | null;
}

interface KaryaTableClientProps {
  initialList: KaryaRow[];
}

export default function KaryaTableClient({ initialList }: KaryaTableClientProps) {
  const router = useRouter();
  const [list, setList] = useState<KaryaRow[]>(initialList);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterJenis, setFilterJenis] = useState<string>('all');

  // State Modal Hapus
  const [modalItem, setModalItem] = useState<KaryaRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter list berdasarkan pencarian & filter
  const filteredList = useMemo(() => {
    return list.filter((item) => {
      // Filter teks pencarian
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.jenis.toLowerCase().includes(q) ||
        (item.kategori?.nama && item.kategori.nama.toLowerCase().includes(q));

      // Filter status
      const matchStatus =
        filterStatus === 'all' || item.status === filterStatus;

      // Filter jenis
      const matchJenis =
        filterJenis === 'all' || item.jenis.toLowerCase() === filterJenis.toLowerCase();

      return matchSearch && matchStatus && matchJenis;
    });
  }, [list, search, filterStatus, filterJenis]);

  const handleOpenDeleteModal = (item: KaryaRow) => {
    setModalItem(item);
    setFeedback(null);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setModalItem(null);
  };

  const handleExecuteDelete = async () => {
    if (!modalItem) return;

    setIsDeleting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/karya/${modalItem.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghapus karya');
      }

      // Hapus item dari local state secara instan
      const deletedName = modalItem.nama;
      setList((prev) => prev.filter((k) => k.id !== modalItem.id));
      setModalItem(null);
      setFeedback({
        type: 'success',
        message: `Karya "${deletedName}" berhasil dihapus dari sistem.`,
      });

      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-sm transition animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Toolbar Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari karya, slug, atau kategori..."
            className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="published">Publik</option>
            <option value="hidden">Disembunyikan</option>
            <option value="draft">Draf</option>
          </select>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Jenis</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="unduhan">Unduhan</option>
            <option value="diy">DIY</option>
          </select>
        </div>
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
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    {search || filterStatus !== 'all' || filterJenis !== 'all'
                      ? 'Tidak ada karya yang sesuai dengan filter pencarian.'
                      : 'Belum ada karya yang ditambahkan.'}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">
                      #{item.urutan}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                          {item.ikon_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.ikon_url}
                              alt={item.nama}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <span className="font-black text-slate-400 text-[11px]">
                              {item.nama.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.nama}</div>
                          <div className="text-[11px] font-mono text-slate-400">/karya/{item.slug}</div>
                        </div>
                      </div>
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
                      <div className="inline-flex items-center gap-1.5">
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
                          title="Edit karya"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(item)}
                          title="Hapus karya"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Karya */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Hapus Karya Digital?
                </h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi penghapusan permanen dari database
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-800">{modalItem.nama}</div>
              <div className="text-[11px] font-mono text-slate-500">/karya/{modalItem.slug}</div>
              <p className="text-xs text-rose-600 mt-2 font-medium">
                Peringatan: Seluruh data karya, tangkapan layar, dan link unduhan terkait akan dihapus secara permanen dan tidak dapat dipulihkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Karya</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
