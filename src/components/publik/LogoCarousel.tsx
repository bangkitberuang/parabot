'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Layers, ExternalLink } from 'lucide-react';

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
  judul = 'Ekosistem Logo & Aplikasi',
  subjudul = 'Identitas visual seragam dari seluruh portofolio digital dan proyek mandiri PARABOT.',
  showParabotBrand = true,
}: LogoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Daftar item termasuk portal PARABOT sebagai anchor utama ekosistem
  const baseItems: LogoCarouselItem[] = [
    ...(showParabotBrand
      ? [
          {
            id: 'parabot-official',
            nama: 'PARABOT',
            slug: '',
            tagline: 'Parabot Digital, Karya Nyata.',
            jenis: 'Studio',
            kategori_nama: 'Induk Ekosistem',
            ikon_url: '/logo.png',
            url_utama: '/',
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

  // Jika item sedikit, gandakan agar loop infinite marquee selalu rapat dan mulus tanpa jeda
  const displayList =
    baseItems.length > 0
      ? [...baseItems, ...baseItems, ...baseItems, ...baseItems]
      : [];

  if (displayList.length === 0) return null;

  return (
    <section
      aria-label="Carousel Logo Ekosistem PARABOT"
      className="relative w-full py-14 sm:py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9] border-t border-slate-200/80 overflow-hidden"
    >
      {/* Ornamen Latar Lembut */}
      <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>SERAGAM · ESTETIK · TERPADU</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          {judul}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2 leading-relaxed">
          {subjudul}
        </p>
      </div>

      {/* Kontainer Marquee dengan Masking Gradasi Halus di Kiri & Kanan */}
      <div className="relative w-full overflow-hidden">
        {/* Lapisan Gradasi Kiri */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-10 pointer-events-none" />
        
        {/* Lapisan Gradasi Kanan */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-10 pointer-events-none" />

        {/* Rel Marquee Bergerak Mulus & Otomatis Berhenti Saat Hover */}
        <div
          ref={containerRef}
          className="animate-marquee-infinite flex items-stretch gap-5 sm:gap-6 py-4 px-6"
        >
          {displayList.map((item, index) => {
            const href = item.slug ? `/karya/${item.slug}` : '/';
            const isParabot = item.id === 'parabot-official';

            return (
              <Link
                key={`${item.id}-${index}`}
                href={href}
                className="group relative flex-shrink-0 w-52 sm:w-60 bg-white rounded-3xl border border-slate-200/85 p-5 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center justify-between"
              >
                {/* Efek Kilau Aksen Hijau Saat Hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="w-full flex flex-col items-center">
                  {/* Wadah Logo Persegi Membulat (Squircle 1:1) Sesuai Desain Resmi */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100/90 p-2 shadow-2xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden mb-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.ikon_url || '/logo.png'}
                      alt={`Logo ${item.nama}`}
                      className="w-full h-full object-contain rounded-xl"
                      loading="lazy"
                    />

                    {isParabot && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                        Utama
                      </div>
                    )}
                  </div>

                  {/* Judul Karya */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1 w-full">
                    {item.nama}
                  </h3>

                  {/* Tagline / Subketerangan */}
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-snug w-full px-1">
                    {item.tagline || item.kategori_nama || 'Produk Digital'}
                  </p>
                </div>

                {/* Bagian Bawah: Badge Kategori & Tautan Cepat */}
                <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {item.jenis || 'Aplikasi'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Petunjuk Interaksi Ramah Pengguna */}
      <div className="text-center mt-5">
        <span className="text-[11px] font-medium text-slate-400 bg-white/60 px-3 py-1 rounded-full border border-slate-200/50 shadow-2xs">
          💡 Arahkan kursor atau sentuh logo untuk menjeda gulir
        </span>
      </div>
    </section>
  );
}
