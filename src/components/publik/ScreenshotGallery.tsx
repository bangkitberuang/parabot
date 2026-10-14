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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation untuk popup lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % screenshots.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, screenshots.length]);

  // Kunci scrolling body saat popup terbuka
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  if (!screenshots || screenshots.length === 0) return null;

  const currentScreenshot =
    selectedIndex !== null ? screenshots[selectedIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-600" />
          <span>Pratinjau Antarmuka & Tangkapan Layar ({screenshots.length})</span>
        </h2>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Klik gambar untuk membuka jendela pop-up pratinjau penuh
        </span>
      </div>

      {/* Grid Thumbnail Gambar */}
      <div
        className={`grid gap-6 ${
          screenshots.length === 1
            ? 'grid-cols-1'
            : screenshots.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {screenshots.map((screen, idx) => (
          <div
            key={screen.id || idx}
            onClick={() => setSelectedIndex(idx)}
            className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-sm hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-full aspect-video relative overflow-hidden bg-slate-950 flex items-center justify-center">
              <Image
                src={screen.url}
                alt={`Screenshot ${karyaNama} #${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Hover overlay dengan tombol zoom */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Perbesar Pop-up</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 capitalize">
                {screen.keterangan ||
                  (idx === 0 ? 'Tampilan Desktop' : 'Tampilan Mobile')}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
              >
                <span>Lihat Pop-up</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POP-UP / LIGHTBOX MODAL */}
      {selectedIndex !== null && currentScreenshot && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Box Modal */}
          <div
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/10 text-white z-10">
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  {karyaNama} ·{' '}
                  <span className="capitalize text-emerald-400">
                    {currentScreenshot.keterangan || `Tangkapan Layar #${selectedIndex + 1}`}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Gambar {selectedIndex + 1} dari {screenshots.length} (Gunakan panah kiri/kanan atau Esc)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentScreenshot.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka File Asli di Tab Baru"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Buka Resolusi Penuh</span>
                </a>
                <button
                  type="button"
                  title="Tutup (Esc)"
                  onClick={() => setSelectedIndex(null)}
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
                src={currentScreenshot.url}
                alt={`Screenshot ${karyaNama} #${selectedIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-lg"
              />

              {/* Tombol Navigasi Kiri */}
              {screenshots.length > 1 && (
                <button
                  type="button"
                  title="Sebelumnya (Panah Kiri)"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(
                      (selectedIndex - 1 + screenshots.length) % screenshots.length
                    );
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
                    setSelectedIndex((selectedIndex + 1) % screenshots.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white shadow-xl backdrop-blur-sm transition border border-white/10 hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip Bawah jika ada > 1 gambar */}
            {screenshots.length > 1 && (
              <div className="px-6 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-center gap-3 overflow-x-auto">
                {screenshots.map((item, thumbIdx) => (
                  <button
                    key={item.id || thumbIdx}
                    type="button"
                    onClick={() => setSelectedIndex(thumbIdx)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedIndex === thumbIdx
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
