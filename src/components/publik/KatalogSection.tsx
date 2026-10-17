'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, Download, Wrench, Code2, Smartphone } from 'lucide-react';
import { stripMarkdown } from '@/lib/utils/markdown';

interface KaryaCard {
  id: string;
  slug: string;
  nama: string;
  tagline: string | null;
  jenis: 'web' | 'mobile' | 'unduhan' | 'diy';
  kategori_nama: string | null;
  kategori_slug: string | null;
  deskripsi: string | null;
  versi: string;
  teknologi: string[];
  unggulan: boolean;
  status: string;
  ikon_url: string | null;
  screenshots: unknown;
}

interface ScreenshotItem {
  url: string;
  keterangan?: string;
}

interface KatalogSectionProps {
  judulSection?: string;
  subjudulSection?: string;
  kategoriList: Array<{ id: string; nama: string; slug: string }>;
  karyaList: KaryaCard[];
}

export default function KatalogSection({
  judulSection = 'Daftar Karya & Proyek',
  subjudulSection = 'Eksplorasi aplikasi web, paket unduhan, dan panduan rekayasa mandiri.',
  kategoriList = [],
  karyaList = [],
}: KatalogSectionProps) {
  const [activeSlug, setActiveSlug] = useState('semua');

  const filteredKarya =
    activeSlug === 'semua'
      ? karyaList
      : activeSlug === 'diy'
      ? karyaList.filter((k) => k.jenis === 'diy')
      : activeSlug === 'mobile'
      ? karyaList.filter((k) => k.jenis === 'mobile')
      : karyaList.filter((k) => k.kategori_slug === activeSlug);

  const getJenisBadge = (jenis: 'web' | 'mobile' | 'unduhan' | 'diy') => {
    switch (jenis) {
      case 'web':
        return {
          label: 'Web App',
          color: 'bg-emerald-50 text-brand-dark border-emerald-200',
          icon: <Globe className="w-3.5 h-3.5 text-brand-primary" />,
        };
      case 'mobile':
        return {
          label: 'Mobile App',
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: <Smartphone className="w-3.5 h-3.5 text-indigo-600" />,
        };
      case 'unduhan':
        return {
          label: 'Unduhan',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Download className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'diy':
        return {
          label: 'DIY',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-6 pt-4 sm:pt-8 pb-20 scroll-mt-12">
      <div id="katalog-diy" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-spruce bg-brand-mint px-3.5 py-1.5 rounded-full border border-emerald-200">
            KARYA TERPILIH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-slate tracking-tight mt-3">
            {judulSection}
          </h2>
          <p className="text-base text-brand-neutral mt-2 max-w-xl">
            {subjudulSection}
          </p>
        </div>

        {/* Filter Pills Dinamis */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSlug('semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              activeSlug === 'semua'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-white text-brand-neutral hover:bg-slate-50 border border-brand-border'
            }`}
          >
            Semua ({karyaList.length})
          </button>
          {karyaList.some((k) => k.jenis === 'mobile') && (
            <button
              onClick={() => setActiveSlug('mobile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                activeSlug === 'mobile'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white text-brand-neutral hover:bg-slate-50 border border-brand-border'
              }`}
            >
              Aplikasi Mobile ({karyaList.filter((k) => k.jenis === 'mobile').length})
            </button>
          )}
          <button
            onClick={() => setActiveSlug('diy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              activeSlug === 'diy'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-white text-brand-neutral hover:bg-slate-50 border border-brand-border'
            }`}
          >
            Proyek DIY ({karyaList.filter((k) => k.jenis === 'diy').length})
          </button>
          {kategoriList.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setActiveSlug(kat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                activeSlug === kat.slug
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white text-brand-neutral hover:bg-slate-50 border border-brand-border'
              }`}
            >
              {kat.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 3 Kolom Desktop, 2 Tablet, 1 HP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredKarya.length === 0 ? (
          <div className="col-span-full text-center py-16 text-brand-neutral text-sm bg-white rounded-2xl border border-brand-border">
            Belum ada karya pada kategori ini.
          </div>
        ) : (
          filteredKarya.map((item) => {
            const badge = getJenisBadge(item.jenis);
            const screenshots = (item.screenshots as unknown as ScreenshotItem[]) || [];
            const firstScreenshot = screenshots.length > 0 ? screenshots[0].url : null;

            // Bersihkan label '(DIY)' jika ada di nama
            const displayTitle = item.nama.replace(/\s*\(DIY\)\s*/i, '').trim();

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Atas Rasio 16:9 (next/image atau fallback ikon) */}
                  <div className="w-full aspect-video bg-gradient-to-br from-brand-pale to-slate-100 border-b border-brand-border relative overflow-hidden flex items-center justify-center">
                    {firstScreenshot ? (
                      <Image
                        src={firstScreenshot}
                        alt={`Screenshot ${displayTitle}`}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-brand-spruce p-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-brand-border flex items-center justify-center mb-2">
                          <Code2 className="w-7 h-7 text-brand-primary" />
                        </div>
                        <span className="text-xs font-bold text-brand-slate tracking-wide">
                          {displayTitle}
                        </span>
                      </div>
                    )}

                    {/* Badge Jenis Berwarna Jelas */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border shadow-sm ${badge.color}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Versi Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/90 text-brand-slate border border-brand-border backdrop-blur-sm shadow-sm">
                        {item.versi}
                      </span>
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-6">
                    <Link href={`/karya/${item.slug}`} className="block">
                      <h3 className="text-xl font-bold text-brand-slate group-hover:text-brand-primary transition-colors mb-1.5 leading-snug">
                        {displayTitle}
                      </h3>
                    </Link>

                    {item.tagline && (
                      <p className="text-xs font-semibold text-brand-spruce mb-3 leading-relaxed">
                        {item.tagline}
                      </p>
                    )}

                    {/* Deskripsi min 15px & kontras tinggi */}
                    <p className="text-[15px] text-brand-neutral leading-relaxed mb-5 line-clamp-3">
                      {stripMarkdown(item.deskripsi)}
                    </p>

                    {/* Tags Teknologi */}
                    {item.teknologi && item.teknologi.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.teknologi.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-semibold text-brand-slate bg-brand-pale border border-brand-border px-2.5 py-1 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.teknologi.length > 3 && (
                          <span className="text-[11px] font-medium text-brand-neutral px-1.5 py-1">
                            +{item.teknologi.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Kartu */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    {item.status ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                        <span className="capitalize">{item.status}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-brand-neutral">Siap pakai</span>
                    )}
                  </div>
                  <Link
                    href={`/karya/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:text-brand-spruce group-hover:translate-x-0.5 transition-all min-h-[44px]"
                  >
                    <span>Detail Karya</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
