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

export default function ScreenshotGallery({
  screenshots,
  karyaNama,
}: ScreenshotGalleryProps) {
  // Indeks foto utama yang sedang ditampilkan
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Indeks untuk modal popup layar penuh (null jika tertutup)
  const [modalIndex, setModalIndex] = useState<number | null>(null);

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-600" />
          <span>Pratinjau Antarmuka & Tangkapan Layar</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {activePhotoIndex + 1} dari {screenshots.length} Foto
        </span>
      </div>

      {/* =========================================================================
          1 FOTO UTAMA PROMINEN (Featured Main Screen)
          ========================================================================= */}
      <div className="space-y-4">
        <div
          onClick={() => setModalIndex(activePhotoIndex)}
          className="group relative w-full aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md hover:shadow-xl transition-all cursor-pointer select-none"
        >
          {/* Gambar Utama */}
          <Image
            src={currentMainPhoto.url}
            alt={`Screenshot ${karyaNama} #${activePhotoIndex + 1}`}
            fill
            priority
            unoptimized
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 800px"
          />

          {/* Badge Label & Posisi */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold capitalize shadow-sm">
              {currentMainPhoto.keterangan ||
                (activePhotoIndex === 0 ? 'Tampilan Utama' : `Tangkapan Layar #${activePhotoIndex + 1}`)}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-bold shadow-sm">
              {activePhotoIndex + 1} / {screenshots.length}
            </span>
          </div>

          {/* Tombol Perbesar Pop-up di Pojok Kanan Atas */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-emerald-600 text-white text-xs font-bold border border-white/15 backdrop-blur-md transition-colors shadow-sm">
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perbesar Layar Penuh</span>
            </span>
          </div>

          {/* Tombol Navigasi Panah Kiri (Jika > 1 Foto) */}
          {screenshots.length > 1 && (
            <button
              type="button"
              aria-label="Foto Sebelumnya"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-md transition opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Tombol Navigasi Panah Kanan (Jika > 1 Foto) */}
          {screenshots.length > 1 && (
            <button
              type="button"
              aria-label="Foto Selanjutnya"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-md transition opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Hover Overlay Lembut */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
            <span className="text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-md">
              <ZoomIn className="w-4 h-4 text-emerald-400" />
              <span>Klik untuk melihat foto dalam resolusi penuh</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            DERETAN THUMBNAIL PEMILIH (Hanya muncul jika foto > 1)
            ========================================================================= */}
        {screenshots.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 px-0.5 scrollbar-thin">
            {screenshots.map((screen, idx) => {
              const isActive = idx === activePhotoIndex;
              return (
                <button
                  key={screen.id || idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-950 ${
                    isActive
                      ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-[1.02] shadow-md'
                      : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <Image
                    src={screen.url}
                    alt={`Thumbnail #${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="120px"
                  />
                  <div
                    className={`absolute bottom-0 inset-x-0 py-0.5 px-1 text-[10px] font-bold text-center truncate ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-black/70 text-slate-200'
                    }`}
                  >
                    {screen.keterangan || `#${idx + 1}`}
                  </div>
                </button>
              );
            })}
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
                  <span className="capitalize text-emerald-400">
                    {modalPhoto.keterangan || `Tangkapan Layar #${modalIndex + 1}`}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Foto {modalIndex + 1} dari {screenshots.length} (Navigasi: tombol panah atau Esc)
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

            {/* Container Gambar Pop-up */}
            <div className="relative flex-1 min-h-[300px] max-h-[75vh] flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalPhoto.url}
                alt={`Screenshot ${karyaNama} #${modalIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-lg"
              />

              {/* Tombol Navigasi Kiri */}
              {screenshots.length > 1 && (
                <button
                  type="button"
                  title="Sebelumnya (Panah Kiri)"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIdx = (modalIndex - 1 + screenshots.length) % screenshots.length;
                    setModalIndex(newIdx);
                    setActivePhotoIndex(newIdx);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white shadow-xl backdrop-blur-sm transition border border-white/10 hover:scale-105"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Tombol Navigasi Kanan */}
              {screenshots.length > 1 && (
                <button
                  type="button"
                  title="Selanjutnya (Panah Kanan)"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIdx = (modalIndex + 1) % screenshots.length;
                    setModalIndex(newIdx);
                    setActivePhotoIndex(newIdx);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white shadow-xl backdrop-blur-sm transition border border-white/10 hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip Bawah di dalam Modal */}
            {screenshots.length > 1 && (
              <div className="px-6 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-center gap-3 overflow-x-auto">
                {screenshots.map((item, thumbIdx) => (
                  <button
                    key={item.id || thumbIdx}
                    type="button"
                    onClick={() => {
                      setModalIndex(thumbIdx);
                      setActivePhotoIndex(thumbIdx);
                    }}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                      modalIndex === thumbIdx
                        ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`Thumbnail #${thumbIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
