import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  getKaryaPublikBySlug,
  getKaryaPublikList,
  getPengaturanSitus,
} from '@/lib/data/publik';
import Navbar from '@/components/publik/Navbar';
import Footer from '@/components/publik/Footer';
import LogoCarousel from '@/components/publik/LogoCarousel';
import { renderMarkdown, stripMarkdown, isMeaningfulContent } from '@/lib/utils/markdown';
import { getDrivePreviewUrl } from '@/lib/utils/drive';
import {
  ExternalLink,
  GitFork,
  Download,
  CheckCircle2,
  Layers,
  FileText,
  Info,
  Video,
  ChevronRight,
  Sparkles,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import ScreenshotGallery, { ScreenshotItem } from '@/components/publik/ScreenshotGallery';
import { ShareWidget, SecurityVerificationBox } from '@/components/publik/KaryaActionWidgets';
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube';

interface KaryaPageProps {
  params: Promise<{ slug: string }>;
}

interface UnduhanItem {
  id: string;
  label: string;
  platform: string;
  url_drive: string;
  ukuran_teks: string | null;
  urutan: number;
  jumlah_klik: number;
  sha256?: string;
}

interface BahanAlatItem {
  nama: string;
  keterangan?: string;
}

export async function generateMetadata({
  params,
}: KaryaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const karya = await getKaryaPublikBySlug(slug);

  if (!karya) {
    return { title: 'Karya Tidak Ditemukan | PARABOT' };
  }

  const cleanDescription = stripMarkdown(karya.deskripsi).slice(0, 160) || karya.tagline || 'Karya Digital PARABOT';
  const screenshots = (karya.screenshots as unknown as ScreenshotItem[]) || [];
  const ogImageUrl = screenshots.length > 0 ? screenshots[0].url : karya.ikon_url || '/og-image.png';
  const siteUrl = 'https://parabot.kitt.lt';
  const pageUrl = `${siteUrl}/karya/${karya.slug}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${karya.nama} - ${karya.tagline || 'Detail Karya'} | PARABOT`,
    description: cleanDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${karya.nama} — ${karya.tagline || 'Karya Digital'}`,
      description: cleanDescription,
      url: pageUrl,
      siteName: 'PARABOT',
      locale: 'id_ID',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Tampilan ${karya.nama}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${karya.nama} | PARABOT`,
      description: cleanDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function KaryaDetailPage({ params }: KaryaPageProps) {
  const { slug } = await params;
  const [karya, allKaryaList, pengaturan] = await Promise.all([
    getKaryaPublikBySlug(slug),
    getKaryaPublikList(),
    getPengaturanSitus(),
  ]);

  if (!karya || karya.status !== 'published') {
    notFound();
  }

  const deskripsiHtml = renderMarkdown(karya.deskripsi);
  const caraPakaiValid = isMeaningfulContent(karya.cara_penggunaan);
  const caraPakaiHtml = caraPakaiValid ? renderMarkdown(karya.cara_penggunaan) : '';

  const unduhanList = (karya.unduhan as unknown as UnduhanItem[]) || [];
  const bahanAlatList = (karya.bahan_alat as unknown as BahanAlatItem[]) || [];
  const screenshotList = (karya.screenshots as unknown as ScreenshotItem[]) || [];

  // Aplikasi terkait (kecuali karya yang sedang dibuka)
  const karyaTerkait = allKaryaList
    .filter((k) => k.id !== karya.id)
    .slice(0, 3);

  // Status siklus hidup aplikasi
  const displayStatus = 'Aktif & Terverifikasi';
  const siteUrl = 'https://parabot.kitt.lt';
  const currentUrl = `${siteUrl}/karya/${karya.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between">
      <div>
        {/* Header Hero Mewah */}
        <div className="relative bg-gradient-to-b from-[#032219] via-[#052E22] to-[#043d2e] text-white pb-12 sm:pb-16 overflow-hidden z-0">
          {Boolean(pengaturan.hero_banner_url) && (
            <div
              className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none transition-all duration-300"
              style={{
                backgroundImage: `url(${(pengaturan.hero_banner_url as string) || '/gedung-sate-angle.png'})`,
                backgroundPosition: (pengaturan.hero_banner_posisi as string) || 'center 85%',
                opacity: (((pengaturan.hero_banner_opacity as number) ?? 50) / 100) * 0.7,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-[#032219]/90 via-[#052E22]/80 to-[#043d2e]/95 pointer-events-none" />

          <div className="relative z-10">
            <Navbar
              brandName={(pengaturan.nama_brand as string) || 'PARABOT'}
              brandTagline={(pengaturan.tagline_brand as string) || 'Portofolio Karya Digital · Bangkit Beruang Dev'}
              logoUrl={(pengaturan.logo_url as string) || ''}
            />

            <div className="max-w-7xl mx-auto px-6 pt-6">
              {/* Breadcrumb Navigasi */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 flex-wrap">
                <Link href="/" className="hover:text-white transition">
                  Beranda
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
                <Link href="/#katalog" className="hover:text-white transition">
                  Koleksi Aplikasi
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
                <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
                  {karya.nama}
                </span>
              </nav>

              <div>
                <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    {karya.kategori_nama || karya.jenis.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                    {karya.versi}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-200 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{displayStatus}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 my-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border border-white/20 p-2 flex items-center justify-center flex-shrink-0 shadow-xl backdrop-blur-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={karya.ikon_url || '/logo.png'}
                      alt={`Logo ${karya.nama}`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                      {karya.nama}
                    </h1>
                    {karya.tagline && (
                      <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mt-1">
                        {karya.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tombol Bagikan Cepat */}
                <ShareWidget title={karya.nama} url={currentUrl} tagline={karya.tagline} />
              </div>
            </div>
          </div>
        </div>

        {/* Konten Utama Detail Karya (2 Kolom) */}
        <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Kolom Kiri: Visual & Deskripsi */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Seksi Pratinjau Visual / Galeri Screenshot Interaktif */}
            {screenshotList.length > 0 && (
              <ScreenshotGallery
                screenshots={screenshotList}
                karyaNama={karya.nama}
              />
            )}

            {/* Kolom Khusus Rekayasa Mandiri (Jika Jenis DIY) */}
            {karya.jenis === 'diy' && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-base font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Informasi Khusus Rekayasa Mandiri (DIY)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/60">
                    <span className="text-xs font-semibold text-slate-500 block">Tingkat Kesulitan</span>
                    <span className="text-sm font-bold text-slate-900">{karya.tingkat_kesulitan || 'Menengah'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/60">
                    <span className="text-xs font-semibold text-slate-500 block">Estimasi Pengerjaan</span>
                    <span className="text-sm font-bold text-slate-900">{karya.estimasi_waktu || '1-2 Jam'}</span>
                  </div>
                </div>

                {bahanAlatList.length > 0 && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-2">
                      Kebutuhan Alat & Bahan:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {bahanAlatList.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          <strong className="font-semibold text-slate-900">{item.nama}</strong>
                          {item.keterangan && <span className="text-slate-500">({item.keterangan})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Seksi Deskripsi (Markdown Terstruktur & Tipografi Rapi) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Deskripsi & Spesifikasi Produk</span>
              </h2>
              <div
                className="prose prose-emerald prose-slate max-w-none text-sm leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:border-b prose-h3:border-slate-100 prose-h3:pb-2 prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-p:text-slate-600 prose-p:leading-relaxed prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-li:text-slate-600 prose-strong:text-slate-900 prose-strong:font-semibold prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
                dangerouslySetInnerHTML={{ __html: deskripsiHtml }}
              />
            </div>

            {/* Seksi Petunjuk Pengoperasian (Disembunyikan Otomatis Jika Kosong / Placeholder) */}
            {caraPakaiValid && caraPakaiHtml && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Petunjuk Pengoperasian</span>
                </h2>
                <div
                  className="prose prose-emerald prose-slate max-w-none text-sm leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1.5 prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: caraPakaiHtml }}
                />
              </div>
            )}

            {/* Seksi Dampak & Nilai Solusi Kedinasan */}
            <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl border border-emerald-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">Dampak & Manfaat Kerja</h3>
                  <span className="text-[11px] text-emerald-700">Nilai tambah untuk produktivitas birokrasi & kehumasan</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">Efisiensi Alur Kerja</span>
                  <span className="text-sm font-bold text-emerald-900">100% Mandiri</span>
                  <p className="text-[11px] text-slate-600 mt-1">Bebas lisensi berbayar dan dapat dijalankan langsung di perangkat kerja.</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">Kerahasiaan Data</span>
                  <span className="text-sm font-bold text-emerald-900">Terenkripsi & Lokal</span>
                  <p className="text-[11px] text-slate-600 mt-1">Dukungan mode luring (*offline*) menjaga kerahasiaan dokumen kedinasan.</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">Standarisasi Format</span>
                  <span className="text-sm font-bold text-emerald-900">Ekspor Siap Cetak</span>
                  <p className="text-[11px] text-slate-600 mt-1">Standar layout A4 dan gambar resolusi tinggi untuk lampiran laporan dinas.</p>
                </div>
              </div>
            </div>

            {/* Pernyataan Privasi & Tata Kelola Data (Kepatuhan UU PDP) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Transparansi Pengelolaan Data (Kepatuhan UU PDP)</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Aplikasi ini dirancang dengan prinsip minimasi data (*data minimization*). Data diagram, berkas, dan proyek disimpan pada peramban lokal (*LocalStorage*) atau akun komputasi awan pribadi pengguna yang terisolasi aman (*PostgreSQL Row Level Security*). Tidak ada data pribadi atau rekaman dokumen kedinasan yang dijual maupun dikirimkan ke pihak ketiga tanpa persetujuan.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                <span>● Tanpa Pelacak Iklan Komersial</span>
                <span>● Akses Otentikasi Terenkripsi</span>
                <span>● Hak Hapus Akun & Data Penuh</span>
              </div>
            </div>

            {/* Seksi Video Tutorial YouTube (Jika Ada) */}
            {Boolean(karya.youtube_url && getYouTubeEmbedUrl(karya.youtube_url)) && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <span>{karya.youtube_title || 'Video Tutorial & Panduan Demonstrasi'}</span>
                  </h2>
                  <a
                    href={karya.youtube_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 transition"
                  >
                    <span>Tonton di YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md">
                  <iframe
                    src={getYouTubeEmbedUrl(karya.youtube_url)!}
                    title={karya.youtube_title || `Tutorial ${karya.nama}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Aksi, Info, Tech, Downloads (Sticky) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit pb-10">
            
            {/* Metadata Card Info & Aksi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col gap-5">
              
              <div className="flex flex-col gap-3">
                {karya.url_utama && (
                  <a
                    href={karya.url_utama}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition min-h-[44px]"
                  >
                    <span>Buka Aplikasi Web</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {karya.url_repositori && (
                  <a
                    href={karya.url_repositori}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-200 transition min-h-[44px]"
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Repositori Kode Sumber</span>
                  </a>
                )}
              </div>

              {(karya.url_utama || karya.url_repositori) && (
                <hr className="border-slate-100" />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Kategori</span>
                  <span className="text-xs font-bold text-slate-800">{karya.kategori_nama || 'Produktivitas'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Status Siklus</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Aktif
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Rilis Publik</span>
                  <span className="text-xs font-bold text-slate-800">{karya.tanggal_rilis}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Platform</span>
                  <span className="text-xs font-bold text-slate-800">{karya.platform || 'Multi-platform'}</span>
                </div>
              </div>

              {/* Riwayat Pembaruan */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Versi: <strong>{karya.versi}</strong>
                </span>
                <span>Pembaruan: <strong>{karya.tanggal_rilis}</strong></span>
              </div>
            </div>

            {/* Seksi Unduhan Resmi & Verifikasi Keamanan */}
            {unduhanList.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Unduhan Installer ({unduhanList.length})</span>
                  </h3>
                </div>

                {/* Box Verifikasi SHA-256 dan Transparansi SmartScreen */}
                <SecurityVerificationBox
                  sha256={unduhanList[0]?.sha256}
                  sourceUrl={karya.url_repositori || 'https://github.com/bangkitberuang/galur/releases'}
                />
                
                <div className="space-y-3 mt-4">
                  {unduhanList.map((unduh) => (
                    <div
                      key={unduh.id}
                      className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{unduh.label}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 flex-wrap">
                          <span className="uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            {unduh.platform}
                          </span>
                          {unduh.ukuran_teks && <span>● {unduh.ukuran_teks}</span>}
                          <span>● {unduh.jumlah_klik || 0}x diunduh</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <a
                          href={`/api/unduh/${unduh.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs min-h-[44px]"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh Berkas Sekarang
                        </a>
                        {unduh.url_drive && unduh.url_drive.includes('drive.google.com') && (
                          <a
                            href={getDrivePreviewUrl(unduh.url_drive)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 transition"
                          >
                            <ExternalLink className="w-3 h-3" /> Buka Tautan Drive
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teknologi yang Digunakan */}
            {karya.teknologi && karya.teknologi.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Teknologi & Lingkungan Runtime
                </h4>
                <div className="flex flex-wrap gap-2">
                  {karya.teknologi.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Seksi Karya Terkait di Bagian Bawah */}
        {karyaTerkait.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pt-6 pb-16 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Karya Digital Lainnya</h3>
                <p className="text-xs text-slate-500 mt-0.5">Jelajahi inovasi dan produk mandiri lainnya di etalase PARABOT</p>
              </div>
              <Link
                href="/#katalog"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Lihat Semua Katalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {karyaTerkait.map((item) => {
                const itemScreens = (item.screenshots as unknown as ScreenshotItem[]) || [];
                const coverUrl = itemScreens.length > 0 ? itemScreens[0].url : item.ikon_url || '/icons/rantang.svg';

                return (
                  <Link
                    key={item.id}
                    href={`/karya/${item.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 mb-3.5 border border-slate-100">
                        <Image
                          src={coverUrl}
                          alt={item.nama}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                          {item.jenis}
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {item.nama}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {item.tagline || stripMarkdown(item.deskripsi)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>Buka Aplikasi</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Sticky Bar Khusus Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 flex items-center justify-between gap-3 shadow-lg">
        <div className="truncate">
          <div className="text-xs font-bold text-slate-900 truncate">{karya.nama}</div>
          <div className="text-[10px] text-slate-500">{karya.versi}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {unduhanList.length > 0 ? (
            <a
              href={`/api/unduh/${unduhanList[0].id}`}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </a>
          ) : karya.url_utama ? (
            <a
              href={karya.url_utama}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 min-h-[44px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Web</span>
            </a>
          ) : null}
        </div>
      </div>

      {/* Logo Carousel Ekosistem Karya di Atas Footer */}
      <LogoCarousel
        karyaList={allKaryaList}
        judul="Ekosistem Karya Lainnya"
        subjudul="Jelajahi portofolio aplikasi dan inovasi mandiri lainnya di etalase PARABOT."
      />

      <Footer
        brandName={pengaturan.nama_brand as string}
        footerText={pengaturan.teks_footer as string}
        disclaimer={pengaturan.disclaimer as string}
        tautanSosial={pengaturan.tautan_sosial as Array<{ platform: string; label: string; url: string }>}
      />
    </div>
  );
}
