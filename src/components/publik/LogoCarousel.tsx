'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface LogoCarouselItem {
  id: string;
  nama: string;
  slug: string;
  tagline?: string | null;
  jenis?: string;
  kategori_nama?: string | null;
  ikon_url?: string | null;
  url_utama?: string | null;
}

interface LogoCarouselProps {
  karyaList?: LogoCarouselItem[];
  judul?: string;
  subjudul?: string;
  showParabotBrand?: boolean;
}

export default function LogoCarousel({
  karyaList = [],
  judul = 'Koleksi Logo & Aplikasi',
  subjudul,
  showParabotBrand = true,
}: LogoCarouselProps) {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Daftar item karya untuk carousel
  const baseItems: LogoCarouselItem[] = [
    ...(showParabotBrand
      ? [
          {
            id: 'parabot-official',
            nama: 'PARABOT',
            slug: 'tentang', // Mengarah ke halaman Tentang PARABOT agar link aktif berfungsi
            tagline: 'Parabot Digital, Karya Nyata.',
            jenis: 'Studio',
            kategori_nama: 'Induk Ekosistem',
            ikon_url: '/logo.png',
            url_utama: '/tentang',
          },
        ]
      : []),
    ...karyaList.map((k) => ({
      id: k.id,
      nama: k.nama.replace(/\s*\(DIY\)\s*/i, '').trim(),
      slug: k.slug,
      tagline: k.tagline,
      jenis: k.jenis,
      kategori_nama: k.kategori_nama,
      ikon_url: k.ikon_url || '/logo.png',
      url_utama: k.url_utama,
    })),
  ];

  // Gandakan item agar animasi infinite marquee selalu rapat dan mulus tanpa jeda
  const displayList =
    baseItems.length > 0
      ? [...baseItems, ...baseItems, ...baseItems, ...baseItems]
      : [];

  if (displayList.length === 0) return null;

  const getHref = (item: LogoCarouselItem) => {
    if (item.id === 'parabot-official') {
      return '/tentang';
    }
    return item.slug ? `/karya/${item.slug}` : '/';
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent, targetHref: string) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;

    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = Date.now() - start.time;

    // Jika pergerakan pointer kecil (< 12px) dan durasi wajar (< 600ms), anggap sebagai klik/tap
    if (dx < 12 && dy < 12 && dt < 600) {
      e.preventDefault();
      router.push(targetHref);
    }
  };

  const handleClick = (e: React.MouseEvent, targetHref: string) => {
    e.preventDefault();
    router.push(targetHref);
  };

  return (
    <section
      aria-label="Carousel Logo Ekosistem PARABOT"
      className="relative w-full py-5 sm:py-6 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9] border-t border-slate-200/80 overflow-hidden"
    >
      {/* Header Pemisah Kompak & Ringkas */}
      <div className="max-w-7xl mx-auto px-6 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span>{judul}</span>
          </h2>
          {subjudul && (
            <span className="text-xs text-slate-400 hidden md:inline">
              · {subjudul}
            </span>
          )}
        </div>

        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
          Sentuh / arahkan kursor untuk menjeda
        </span>
      </div>

      {/* Kontainer Marquee dengan Masking Gradasi Halus di Tepi */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 2000);
        }}
      >
        {/* Lapisan Gradasi Kiri */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none" />

        {/* Lapisan Gradasi Kanan */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none" />

        {/* Rel Marquee Bergerak Mulus */}
        <div
          className="animate-marquee-infinite flex items-center gap-3 sm:gap-4 py-2 px-6"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {displayList.map((item, index) => {
            const href = getHref(item);
            const isParabot = item.id === 'parabot-official';

            return (
              <Link
                key={`${item.id}-${index}`}
                href={href}
                onClick={(e) => handleClick(e, href)}
                onPointerDown={handlePointerDown}
                onPointerUp={(e) => handlePointerUp(e, href)}
                className="group relative flex-shrink-0 w-32 sm:w-36 bg-white rounded-2xl border border-slate-200/85 p-2 sm:p-2.5 shadow-2xs hover:shadow-lg hover:border-emerald-400 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center cursor-pointer select-none"
              >
                {/* Efek Kilau Aksen Saat Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Wadah Logo Persegi Membulat (Squircle 1:1 Sesuai Ukuran Ideal) */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shadow-2xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.ikon_url || '/logo.png'}
                    alt={`Logo ${item.nama}`}
                    className="w-full h-full object-contain rounded-xl pointer-events-none"
                    loading="lazy"
                    draggable={false}
                  />

                  {isParabot && (
                    <div className="absolute top-1 right-1 px-1 py-0.5 rounded-md bg-emerald-600 text-white text-[8px] font-black tracking-wider uppercase shadow-2xs">
                      Utama
                    </div>
                  )}
                </div>

                {/* Judul Karya Kompak */}
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1 w-full mt-2">
                  {item.nama}
                </span>

                {/* Label Jenis / Kategori Mini */}
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors line-clamp-1 mt-0.5">
                  {isParabot ? 'Tentang Studio' : item.jenis?.toUpperCase() || 'APLIKASI'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
