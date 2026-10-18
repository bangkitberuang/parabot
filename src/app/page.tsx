import React from 'react';
import Link from 'next/link';
import {
  getPengaturanSitus,
  getKategoriAktif,
  getKaryaPublikList,
} from '@/lib/data/publik';
import Navbar from '@/components/publik/Navbar';
import Footer from '@/components/publik/Footer';
import LogoCarousel from '@/components/publik/LogoCarousel';
import KatalogSection from '@/components/publik/KatalogSection';
import DeviceMockup from '@/components/publik/DeviceMockup';
import {
  ChevronRight,
  Code2,
  HeartHandshake,
  Compass,
  Sparkles,
} from 'lucide-react';

interface TombolHero {
  teks: string;
  href: string;
}

interface UnduhanInfo {
  jumlah_klik?: number;
}

export default async function HomePage() {
  const [pengaturan, kategoriList, karyaList] = await Promise.all([
    getPengaturanSitus(),
    getKategoriAktif(),
    getKaryaPublikList(),
  ]);

  // Statistik Nyata dari Database
  const totalKaryaAktif = karyaList.length;
  let totalKlikUnduhanNyata = 0;
  karyaList.forEach((k) => {
    if (Array.isArray(k.unduhan)) {
      (k.unduhan as unknown as UnduhanInfo[]).forEach((u) => {
        totalKlikUnduhanNyata += u.jumlah_klik || 0;
      });
    }
  });

  const totalKategoriAktif = kategoriList.length;

  // Temukan karya unggulan untuk mockup hero (misalnya KARSA atau RANTANG)
  const karyaUnggulan = karyaList.find((k) => k.unggulan) || karyaList[0];

  const heroTombolUtama = pengaturan.hero_tombol_utama as unknown as TombolHero | undefined;
  const heroTombolKedua = pengaturan.hero_tombol_kedua as unknown as TombolHero | undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-brand-slate antialiased selection:bg-brand-primary selection:text-white">
      {/* =========================================================================
          HERO SECTION: Nuansa Hijau Tua (#064E3B / #052E22) & Aksen Emerald
          ========================================================================= */}
      <div className="relative bg-gradient-to-b from-[#032219] via-[#052E22] to-[#043d2e] text-white overflow-hidden pb-24 lg:pb-32">
        {/* Latar Ilustrasi Ikonik Gedung Sate Sudut Perspektif (Posisi & Opasitas Dinamis dari Database) */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none transition-all duration-300"
          style={{
            backgroundImage: `url(${(pengaturan.hero_banner_url as string) || '/gedung-sate-angle.png'})`,
            backgroundPosition: (pengaturan.hero_banner_posisi as string) || 'center 85%',
            opacity: ((pengaturan.hero_banner_opacity as number) ?? 60) / 100,
          }}
        />

        {/* Lapisan Scrim Gelap Solid di Area Teks Atas & Tengah (Menjamin Teks 100% Kontras & Bersih) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#032219]/95 via-[#032219]/80 to-[#043d2e]/90 pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-[#032219]/70 rounded-full blur-3xl pointer-events-none" />

        {/* Navbar */}
        <Navbar
          brandName={(pengaturan.nama_brand as string) || 'PARABOT'}
          brandTagline={(pengaturan.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev'}
          logoUrl={(pengaturan.logo_url as string) || ''}
        />

        {/* Hero Header Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-mint text-xs font-bold tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>{(pengaturan.hero_badge as string) || (pengaturan.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev'}</span>
          </div>

          {/* Judul Hero Dinamis dari Pengaturan */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6">
            {(pengaturan.hero_judul as string) || 'Karya digital dari seorang ASN yang terus belajar.'}
          </h1>

          {/* Subjudul Personal Dinamis dari Pengaturan */}
          <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            {(pengaturan.hero_subjudul as string) || 'Saya seorang pranata humas yang mencintai teknologi dan belajar menjadi developer—merancang aplikasi sederhana, alat bantu kerja, dan dokumentasi terbuka untuk mendukung tugas sehari-hari.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={heroTombolUtama?.href?.startsWith('#') ? `/${heroTombolUtama.href}` : (heroTombolUtama?.href || '/#katalog')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-spruce text-white font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5 min-h-[44px]"
            >
              <span>{heroTombolUtama?.teks || 'Lihat Koleksi Karya'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href={heroTombolKedua?.href?.startsWith('#') ? `/${heroTombolKedua.href}` : (heroTombolKedua?.href || '/tentang')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition min-h-[44px]"
            >
              <span>{heroTombolKedua?.teks || 'Tentang PARABOT'}</span>
            </Link>
          </div>
        </div>

        {/* Wave Divider Lembut ke Latar Body */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F8FAFC] [clip-path:ellipse(65%_100%_at_50%_100%)]"></div>
      </div>

      {/* =========================================================================
          MOCKUP LAPTOP & HP KARYA UNGGULAN (Komponen DeviceMockup dengan Gambar Asli)
          ========================================================================= */}
      <DeviceMockup
        karya={karyaUnggulan as unknown as React.ComponentProps<typeof DeviceMockup>['karya']}
        fallbackKaryaList={karyaList}
      />

      {/* =========================================================================
          SATU STRIP ANGKA STATISTIK (Hanya Tampilkan Yang > 0)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-6 mt-12 sm:mt-16 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border flex flex-wrap items-center justify-around gap-6 text-center">
          {totalKaryaAktif > 0 && (
            <div className="px-4">
              <div className="text-3xl font-extrabold text-brand-primary mb-0.5">
                {totalKaryaAktif}
              </div>
              <div className="text-xs font-semibold text-brand-neutral uppercase tracking-wider">
                Total Karya
              </div>
            </div>
          )}

          {totalKategoriAktif > 0 && (
            <div className="px-4 border-l border-slate-100">
              <div className="text-3xl font-extrabold text-brand-slate mb-0.5">
                {totalKategoriAktif}
              </div>
              <div className="text-xs font-semibold text-brand-neutral uppercase tracking-wider">
                Bidang / Kategori
              </div>
            </div>
          )}

          {totalKlikUnduhanNyata > 0 && (
            <div className="px-4 border-l border-slate-100">
              <div className="text-3xl font-extrabold text-brand-spruce mb-0.5">
                {totalKlikUnduhanNyata}
              </div>
              <div className="text-xs font-semibold text-brand-neutral uppercase tracking-wider">
                Total Unduhan
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          KATALOG KARYA & DIY (Grid 3 Kolom Desktop, 2 Tablet, 1 HP)
          ========================================================================= */}
      <KatalogSection
        judulSection="Daftar Karya & Proyek"
        subjudulSection="Aplikasi yang saya bangun secara mandiri untuk menjawab kendala kerja harian."
        kategoriList={kategoriList}
        karyaList={karyaList}
      />

      {/* =========================================================================
          CARA SAYA BERKARYA (Menggantikan Brosur Korporat 'Mengapa Memilih Ekosistem')
          ========================================================================= */}
      <section id="keunggulan" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-12">
        <div id="fitur" className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-spruce bg-brand-mint px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span>🌿</span>
            <span>PRINSIP BERKARYA · TATAR PASUNDAN</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-slate tracking-tight mt-3">
            Cara Saya Berkarya
          </h2>
          <p className="text-base text-brand-neutral mt-2">
            Tiga pedoman sederhana di balik setiap baris kode dan aplikasi yang saya buat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-mint text-brand-primary flex items-center justify-center mb-5 font-bold">
              <Compass className="w-6 h-6 text-brand-spruce" />
            </div>
            <h3 className="text-lg font-bold text-brand-slate mb-2">Berangkat dari Masalah Riil</h3>
            <p className="text-sm text-brand-neutral leading-relaxed">
              Saya tidak membuat fitur berlebihan. Setiap karya dimulai dari rasa jenuh terhadap pekerjaan manual yang repetitif di meja kerja.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-mint text-brand-primary flex items-center justify-center mb-5 font-bold">
              <Code2 className="w-6 h-6 text-brand-spruce" />
            </div>
            <h3 className="text-lg font-bold text-brand-slate mb-2">Sederhana & Mudah Digunakan</h3>
            <p className="text-sm text-brand-neutral leading-relaxed">
              Antarmuka dirancang seringkas mungkin agar rekan kerja dapat langsung menggunakannya tanpa perlu membaca buku panduan yang tebal.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-mint text-brand-primary flex items-center justify-center mb-5 font-bold">
              <HeartHandshake className="w-6 h-6 text-brand-spruce" />
            </div>
            <h3 className="text-lg font-bold text-brand-slate mb-2">Dokumentasi Terbuka & Bermanfaat</h3>
            <p className="text-sm text-brand-neutral leading-relaxed">
              Semua alur perakitan dibagikan secara transparan agar dapat dipelajari, direplikasi, atau dikembangkan bersama oleh rekan-rekan lain.
            </p>
          </div>
        </div>
      </section>



      {/* Logo Carousel Ekosistem Karya di Atas Footer */}
      <LogoCarousel
        karyaList={karyaList}
        judul="Ekosistem Karya & Solusi Digital"
        subjudul="Koleksi logo dan tautan cepat ke seluruh aplikasi mandiri yang dirancang untuk mendukung operasional kerja sehari-hari."
      />

      {/* Footer Nuansa Hijau Tua dengan Latar Dinamis */}
      <Footer
        brandName={(pengaturan.nama_brand as string) || 'PARABOT'}
        footerText={(pengaturan.teks_footer as string) || 'Koleksi aplikasi dan dokumentasi digital mandiri oleh Bangkit Beruang Dev.'}
        disclaimer={(pengaturan.disclaimer as string) || '© 2026 PARABOT. Dibangun dengan rasa ingin tahu dan dedikasi belajar.'}
        tautanSosial={pengaturan.tautan_sosial as Array<{ platform: string; label: string; url: string }>}
        bannerUrl={(pengaturan.footer_banner_url as string) || '/gedung-sate-wide.png'}
        bannerPosisi={(pengaturan.footer_banner_posisi as string) || 'center top'}
        bannerOpacity={(pengaturan.footer_banner_opacity as number) ?? 60}
      />
    </div>
  );
}
