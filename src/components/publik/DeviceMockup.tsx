import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, FolderGit2 } from 'lucide-react';

interface KaryaUnggulanData {
  id: string;
  slug: string;
  nama: string;
  tagline?: string | null;
  jenis: 'web' | 'mobile' | 'unduhan' | 'diy';
  kategori_nama?: string | null;
  deskripsi?: string | null;
  screenshots?: Array<{
    id: string;
    url: string;
    keterangan?: string | null;
    urutan?: number;
  }>;
}

interface DeviceMockupProps {
  karya?: KaryaUnggulanData | null;
  fallbackKaryaList?: Array<{
    id: string;
    slug: string;
    nama: string;
    jenis: string;
    kategori_nama?: string | null;
  }>;
}

export default function DeviceMockup({ karya, fallbackKaryaList = [] }: DeviceMockupProps) {
  // Temukan screenshot desktop dan mobile
  const screenshots = karya?.screenshots || [];
  
  const desktopScreenshot =
    screenshots.find(
      (s) => s.keterangan?.toLowerCase() === 'desktop' || s.url.includes('desktop')
    )?.url || (screenshots.length > 0 ? screenshots[0].url : '/mockups/karsa-desktop.png');

  const mobileScreenshot =
    screenshots.find(
      (s) => s.keterangan?.toLowerCase() === 'mobile' || s.url.includes('mobile')
    )?.url || (screenshots.length > 1 ? screenshots[1].url : '/mockups/karsa-mobile.png');

  const hasScreenshots = Boolean(desktopScreenshot);

  // FALLBACK: Bila tidak ada karya atau tidak ada screenshot sama sekali
  if (!hasScreenshots) {
    if (fallbackKaryaList.length > 0) {
      return (
        <div className="relative z-20 max-w-4xl mx-auto px-6 -mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fallbackKaryaList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-brand-border shadow-lg flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-mint flex items-center justify-center text-brand-primary font-bold">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-slate">{item.nama}</h4>
                  <span className="text-xs text-brand-neutral uppercase tracking-wider">{item.jenis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-28">
      {/* Container Relatif untuk Laptop & HP */}
      <div className="relative mx-auto max-w-4xl">
        {/* Glow Halus di Belakang Perangkat */}
        <div className="absolute inset-0 bg-emerald-950/25 rounded-3xl blur-2xl transform translate-y-6 -z-10 pointer-events-none" />

        {/* =========================================================================
            LAPTOP MOCKUP (Bingkai Bezel Tipis, Rasio 16:10, Browser Header Bersih)
            ========================================================================= */}
        <div className="bg-[#1e293b] rounded-t-2xl p-2 sm:p-3 shadow-2xl border border-slate-700/80">
          {/* Header Browser Laptop */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-t-xl border-b border-slate-800">
            {/* Titik Tiga Warna */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* Bilah Alamat Bersih: Hanya Nama Karya (Tanpa Domain Palsu) */}
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-1 rounded-md border border-slate-800/80 text-[11px] text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="tracking-wide">{karya?.nama || 'Aplikasi Pilihan'}</span>
            </div>

            {/* Action Tautan Langsung ke Karya */}
            <div>
              {karya?.slug && (
                <Link
                  href={`/karya/${karya.slug}`}
                  title="Lihat detail karya"
                  className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span className="hidden sm:inline">Detail</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Layar Laptop: Menampilkan GAMBAR ASLI (Rasio 16:10) */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-b-xl overflow-hidden">
            <Image
              src={desktopScreenshot}
              alt={`Tampilan Desktop ${karya?.nama || 'Aplikasi'}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Dasar (Base/Alas) Laptop Halus MacBook Style */}
        <div className="relative bg-[#0f172a] h-3.5 sm:h-5 rounded-b-xl shadow-xl flex items-center justify-center border-t border-slate-700/60">
          <div className="w-16 sm:w-28 h-1.5 sm:h-2 bg-slate-700 rounded-b-md" />
        </div>

        {/* =========================================================================
            HP MOCKUP (Rasio 9:19.5, Lebar ~24% Laptop, Overlap Aman di Kanan Bawah)
            Di HP (layar kecil < 640px), tersembunyi agar tidak menimpa dan tidak scroll horizontal
            ========================================================================= */}
        {mobileScreenshot && (
          <aside
            aria-label="Tampilan Ponsel"
            className="hidden sm:block absolute -bottom-5 sm:-bottom-7 -right-2 sm:-right-6 w-[23%] max-w-[210px] min-w-[150px] aspect-[9/19.5] bg-[#0f172a] rounded-[2.2rem] p-2 shadow-2xl border-[3.5px] border-slate-700 transform hover:-translate-y-1 transition-transform duration-300 z-30"
          >
            {/* Notch / Dynamic Island Halus */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-11 h-2.5 bg-slate-950 rounded-full z-20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Layar HP: Menampilkan GAMBAR ASLI Ponsel */}
            <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-950">
              <Image
                src={mobileScreenshot}
                alt={`Tampilan Mobile ${karya?.nama || 'Aplikasi'}`}
                fill
                loading="lazy"
                sizes="210px"
                className="object-cover object-top"
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
