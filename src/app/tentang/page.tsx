import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  getHalamanStatis,
  getPengaturanSitus,
  getKaryaPublikList,
} from '@/lib/data/publik';
import Navbar from '@/components/publik/Navbar';
import Footer from '@/components/publik/Footer';
import LogoCarousel from '@/components/publik/LogoCarousel';
import { renderMarkdown } from '@/lib/utils/markdown';
import { Mail, Briefcase, ChevronRight, User } from 'lucide-react';

// Pastikan selalu ambil data terkini dari database tanpa cache statis
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const halaman = await getHalamanStatis('tentang');
  if (!halaman) return { title: 'Tentang PARABOT' };
  return {
    title: halaman.judul,
  };
}

export default async function TentangPage() {
  const [halaman, pengaturan, karyaList] = await Promise.all([
    getHalamanStatis('tentang'),
    getPengaturanSitus(),
    getKaryaPublikList(),
  ]);

  if (!halaman || !halaman.tampil) {
    notFound();
  }

  const isiHtml = renderMarkdown(halaman.isi);
  const bannerUrl = (pengaturan.tentang_banner_url as string) || '';
  const bannerPosisi = (pengaturan.tentang_banner_posisi as string) || 'center center';
  const bannerOpacity = typeof pengaturan.tentang_banner_opacity === 'number'
    ? pengaturan.tentang_banner_opacity / 100
    : Number(pengaturan.tentang_banner_opacity || 60) / 100;

  // Filter 3 karya untuk sidebar
  const karyaSidebar = karyaList.filter(k => k.unggulan).slice(0, 3);
  if (karyaSidebar.length < 3) {
    karyaSidebar.push(...karyaList.filter(k => !k.unggulan).slice(0, 3 - karyaSidebar.length));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between">
      <div>
        <div className="relative bg-gradient-to-b from-[#032219] via-[#052E22] to-[#043d2e] text-white pb-12 sm:pb-16 overflow-hidden z-0">
          {/* Banner Latar Belakang */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerUrl || (pengaturan.hero_banner_url as string) || '/gedung-sate-angle.png'}
              alt="Banner Tentang"
              className="w-full h-full object-cover transition duration-500"
              style={{
                objectPosition: bannerPosisi,
                opacity: bannerOpacity,
              }}
            />
            {/* Gradien overlay agar teks tetap sangat terbaca kontras */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#032219]/90 via-[#052E22]/80 to-[#043d2e]/95" />
          </div>

          <div className="relative z-10">
            <Navbar
              brandName={(pengaturan.nama_brand as string) || 'PARABOT'}
              brandTagline={(pengaturan.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev'}
              logoUrl={(pengaturan.logo_url as string) || ''}
            />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                {halaman.judul}
              </h1>
            </div>
          </div>
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Kolom Kiri: Konten Utama Markdown (Lebih Lebar) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
              <div
                className="prose prose-slate max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: isiHtml }}
              />
            </div>
          </div>

          {/* Kolom Kanan: Sidebar Informasi Tambahan */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profil Author */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-mint/20 rounded-full flex items-center justify-center text-brand-primary mb-4 ring-4 ring-white border border-brand-mint/30 shadow-sm">
                {pengaturan.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pengaturan.logo_url as string} alt="Logo" className="w-12 h-12 object-contain" />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{(pengaturan.nama_brand as string) || 'PARABOT'}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
                {(pengaturan.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev'}
              </p>
              
              <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a href="mailto:halo@bangkitberuang.com" className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Hubungi Kami</span>
                </a>
              </div>
            </div>

            {/* List Karya Unggulan */}
            {karyaSidebar.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-primary" />
                  Karya Sorotan
                </h3>
                <div className="space-y-4">
                  {karyaSidebar.map((k) => (
                    <Link href={`/karya/${k.slug}`} key={k.id} className="group block">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 overflow-hidden">
                          {k.ikon_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={k.ikon_url} alt={k.nama} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
                          ) : (
                            <div className="w-8 h-8 bg-slate-200 rounded-md"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition truncate">
                            {k.nama}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {k.tagline}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link href="/#katalog" className="text-xs font-bold text-brand-primary hover:text-brand-emerald flex items-center gap-1 group w-max">
                    Lihat Semua Karya
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Logo Carousel Ekosistem Karya di Atas Footer */}
      <LogoCarousel
        karyaList={karyaList}
        judul="Ekosistem Karya & Solusi Digital"
        subjudul="Koleksi logo dan tautan cepat ke seluruh aplikasi mandiri yang dirancang untuk mendukung operasional kerja sehari-hari."
      />

      <Footer
        brandName={(pengaturan.nama_brand as string) || 'PARABOT'}
        footerText={(pengaturan.teks_footer as string) || ''}
        disclaimer={(pengaturan.disclaimer as string) || ''}
        tautanSosial={(pengaturan.tautan_sosial as Array<{ platform: string; label: string; url: string }>) || []}
      />
    </div>
  );
}
