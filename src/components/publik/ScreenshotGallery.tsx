'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ExternalLink,
  Maximize2,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';

export interface ScreenshotItem {
  id: string;
  url: string;
  keterangan?: string | null;
  urutan?: number;
}

interface ScreenshotGalleryProps {
  screenshots: ScreenshotItem[];
  karyaNama: string;
}

function cleanLabel(raw: string | null | undefined, idx: number): string {
  if (!raw || /^(desktop|mobile|screenshot|tangkapan layar)$/i.test(raw.trim())) {
    return idx === 0 ? 'Tampilan Antarmuka Utama' : `Tangkapan Layar Fitur #${idx + 1}`;
  }
  return raw;
}

export default function ScreenshotGallery({
  screenshots,
  karyaNama,
}: ScreenshotGalleryProps) {
  // Indeks foto utama yang sedang ditampilkan
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Indeks untuk modal popup layar penuh (null jika tertutup)
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  // Status error gambar untuk graceful fallback
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Keyboard navigation untuk popup lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIndex === null) return;
      if (e.key === 'Escape') setModalIndex(null);
      if (e.key === 'ArrowRight') {
        setModalIndex((prev) =>
          prev !== null ? (prev + 1) % screenshots.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setModalIndex((prev) =>
          prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalIndex, screenshots.length]);

  // Kunci scrolling body saat popup terbuka
  useEffect(() => {
    if (modalIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalIndex]);

  if (!screenshots || screenshots.length === 0) return null;

  const currentMainPhoto = screenshots[activePhotoIndex] || screenshots[0];
  const modalPhoto = modalIndex !== null ? screenshots[modalIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % screenshots.length);
  };

  const activeLabel = cleanLabel(currentMainPhoto.keterangan, activePhotoIndex);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-600" />
          <span>Pratinjau Antarmuka & Tangkapan Layar</span>
        </h2>
        <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
          {activePhotoIndex + 1} dari {screenshots.length} Foto
        </span>
      </div>

      {/* =========================================================================
          1 FOTO UTAMA PROMINEN (Browser Mockup Frame Yang Terang & Jernih)
          ========================================================================= */}
      <div className="space-y-4">
        <div
          onClick={() => setModalIndex(activePhotoIndex)}
          className="group relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer select-none"
        >
          {/* Header Browser Window Mockup (Memberi Konteks Jernih & Cerah) */}
          <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
            {/* Tiga Tombol Window Mac/Browser */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-500/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/30" />
            </div>

            {/* Omnibox / URL Pill */}
            <div className="flex-1 max-w-sm mx-auto flex items-center justify-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200/90 text-[11px] font-mono text-slate-600 truncate shadow-2xs">
              <Globe className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{activeLabel}</span>
            </div>

            {/* Tombol Perbesar */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-[11px] border border-slate-200 transition shadow-2xs">
                <Maximize2 className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Perbesar</span>
              </span>
            </div>
          </div>

          {/* Area Kanvas Gambar (Background Terang Bersih, Tanpa Opasitas Gelap) */}
          <div className="relative w-full aspect-[16/10] sm:aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
            {failedImages[currentMainPhoto.url] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-2 shadow-xs">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-800">{activeLabel}</span>
                <span className="text-xs text-slate-400 mt-1">Pratinjau visual produk</span>
              </div>
            ) : (
              <Image
                src={currentMainPhoto.url}
                alt={`${karyaNama} - ${activeLabel}`}
                fill
                priority
                unoptimized
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 860px"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [currentMainPhoto.url]: true }))
                }
              />
            )}

            {/* Tombol Navigasi Panah Kiri */}
            {screenshots.length > 1 && (
              <button
                type="button"
                aria-label="Foto Sebelumnya"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 shadow-md backdrop-blur-xs transition hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Tombol Navigasi Panah Kanan */}
            {screenshots.length > 1 && (
              <button
                type="button"
                aria-label="Foto Selanjutnya"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 shadow-md backdrop-blur-xs transition hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Hint Klik Perbesar */}
            <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1 shadow-sm">
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Klik untuk resolusi penuh</span>
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DERETAN THUMBNAIL PEMILIH (Cerah, Bersih, Tanpa Tulisan 'mobile' / 'desktop')
            ========================================================================= */}
        {screenshots.length > 1 && (
          <div>
            <div className="flex items-center gap-3 overflow-x-auto py-1.5 px-0.5 scrollbar-thin">
              {screenshots.map((screen, idx) => {
                const isActive = idx === activePhotoIndex;
                const thumbLabel = cleanLabel(screen.keterangan, idx);

                return (
                  <button
                    key={screen.id || idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    title={thumbLabel}
                    className={`relative w-24 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden transition-all flex-shrink-0 bg-white border-2 ${
                      isActive
                        ? 'border-emerald-500 ring-2 ring-emerald-400/40 shadow-md scale-[1.03]'
                        : 'border-slate-200 hover:border-emerald-400 hover:shadow-xs'
                    }`}
                  >
                    <Image
                      src={screen.url}
                      alt={thumbLabel}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="120px"
                    />

                    {/* Tag Nomor Foto di Pojok Kanan Atas (Sangat Rapi & Bersih) */}
                    <div
                      className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-2xs ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/90 text-slate-700 border border-slate-200'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-1">
              {activeLabel}
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          POP-UP / LIGHTBOX MODAL RESOLUSI PENUH
          ========================================================================= */}
      {modalIndex !== null && modalPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setModalIndex(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-white/10 text-white z-10">
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  {karyaNama} ·{' '}
                  <span className="text-emerald-400">
                    {cleanLabel(modalPhoto.keterangan, modalIndex)}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Foto {modalIndex + 1} dari {screenshots.length} (Gunakan tombol panah ◀ ▶ atau Esc)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={modalPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka File Asli di Tab Baru"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Buka Resolusi Asli</span>
                </a>
                <button
                  type="button"
                  title="Tutup (Esc)"
                  onClick={() => setModalIndex(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Konten Foto Modal */}
            <div className="relative flex-1 min-h-[50vh] max-h-[76vh] w-full bg-slate-950 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <Image
                src={modalPhoto.url}
                alt={`${karyaNama} #${modalIndex + 1}`}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 1536px) 100vw, 1536px"
              />

              {/* Navigasi Panah Modal Kiri */}
              {screenshots.length > 1 && (
                <button
                  type="button"
                  aria-label="Foto Sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalIndex(
                      (prev) => (prev! - 1 + screenshots.length) % screenshots.length
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-md transition hover:scale-110 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Navigasi Panah Modal Kanan */}
              {screenshots.length > 1 && (
                <button
                  type="button"
                  aria-label="Foto Selanjutnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalIndex((prev) => (prev! + 1) % screenshots.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-md transition hover:scale-110 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>{cleanLabel(modalPhoto.keterangan, modalIndex)}</span>
              <span className="font-mono text-emerald-400 font-bold">
                {modalIndex + 1} / {screenshots.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
