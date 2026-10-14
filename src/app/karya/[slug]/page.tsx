import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getKaryaPublikBySlug,
  getPengaturanSitus,
} from '@/lib/data/publik';
import Navbar from '@/components/publik/Navbar';
import Footer from '@/components/publik/Footer';
import { renderMarkdown } from '@/lib/utils/markdown';
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
} from 'lucide-react';
import ScreenshotGallery, { ScreenshotItem } from '@/components/publik/ScreenshotGallery';
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
    return { title: 'Karya Tidak Ditemukan' };
  }

  return {
    title: `${karya.nama} - ${karya.tagline || 'Detail Karya'}`,
    description: karya.deskripsi ? karya.deskripsi.slice(0, 160) : undefined,
    openGraph: {
      title: karya.nama,
      description: karya.deskripsi || undefined,
      images: karya.ikon_url ? [{ url: karya.ikon_url }] : [],
    },
  };
}

export default async function KaryaDetailPage({ params }: KaryaPageProps) {
  const { slug } = await params;
  const [karya, pengaturan] = await Promise.all([
    getKaryaPublikBySlug(slug),
    getPengaturanSitus(),
  ]);

  if (!karya || karya.status !== 'published') {
    notFound();
  }

  const deskripsiHtml = renderMarkdown(karya.deskripsi);
  const caraPakaiHtml = renderMarkdown(karya.cara_penggunaan);

  const unduhanList = (karya.unduhan as unknown as UnduhanItem[]) || [];
  const bahanAlatList = (karya.bahan_alat as unknown as BahanAlatItem[]) || [];
  const screenshotList = (karya.screenshots as unknown as ScreenshotItem[]) || [];

  // Konversi status ke bentuk layar
  const displayStatus = 'Aktif';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between">
      <div>
        {/* Compact Header */}
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
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    {karya.kategori_nama || karya.jenis.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                    {karya.versi}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5">
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                    {karya.nama}
                  </h1>
                  {karya.tagline && (
                    <>
                      <div className="hidden md:block w-px h-8 bg-emerald-500/40"></div>
                      <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                        {karya.tagline}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Konten Utama Detail Karya (2 Kolom) */}
        <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Kolom Kiri: Visual & Deskripsi */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Seksi Pratinjau Visual / Galeri Screenshot Interaktif Pop-up */}
            {screenshotList.length > 0 && (
              <ScreenshotGallery
                screenshots={screenshotList}
                karyaNama={karya.nama}
              />
            )}

            {/* Kolom Khusus DIY (Jika Jenis DIY) */}
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

            {/* Seksi Deskripsi (Markdown Rendered Aman) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Deskripsi & Fungsi Produk</span>
              </h2>
              <div
                className="prose max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: deskripsiHtml }}
              />
            </div>

            {/* Seksi Cara Penggunaan */}
            {caraPakaiHtml && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Petunjuk Pengoperasian</span>
                </h2>
                <div
                  className="prose max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: caraPakaiHtml }}
                />
              </div>
            )}

            {/* Seksi Video Tutorial / Demonstrasi YouTube */}
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
                    className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition"
                  >
                    <span>Buka Aplikasi</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {karya.url_repositori && (
                  <a
                    href={karya.url_repositori}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Kode Sumber</span>
                  </a>
                )}
              </div>

              {(karya.url_utama || karya.url_repositori) && (
                <hr className="border-slate-100" />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Jenis Produk</span>
                  <span className="text-sm font-bold text-slate-800 uppercase">{karya.jenis}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Rilis Publik</span>
                  <span className="text-sm font-bold text-slate-800">{karya.tanggal_rilis}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Platform</span>
                  <span className="text-sm font-bold text-slate-800">{karya.platform || 'Multi-platform'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Status</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {displayStatus}
                  </span>
                </div>
              </div>
            </div>

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

            {/* Seksi Unduhan Resmi */}
            {unduhanList.length > 0 && (
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Unduhan ({unduhanList.length})</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                    Aman
                  </span>
                </div>
                
                <div className="space-y-3 mt-4">
                  {unduhanList.map((unduh) => (
                    <div
                      key={unduh.id}
                      className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col gap-3 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{unduh.label}</h4>
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
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh Berkas
                        </a>
                        <a
                          href={getDrivePreviewUrl(unduh.url_drive)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                        >
                          <ExternalLink className="w-3 h-3" /> Buka di Drive
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
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
              <span>Unduh ({unduhanList[0].ukuran_teks || 'Berkas'})</span>
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

      <Footer
        brandName={pengaturan.nama_brand as string}
        footerText={pengaturan.teks_footer as string}
        disclaimer={pengaturan.disclaimer as string}
        tautanSosial={pengaturan.tautan_sosial as Array<{ platform: string; label: string; url: string }>}
      />
    </div>
  );
}
