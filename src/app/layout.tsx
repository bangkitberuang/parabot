import { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { getPengaturanSitus } from '@/lib/data/publik';
import RootClientLayout from './RootClientLayout';
import FloatingWhatsApp from '@/components/publik/FloatingWhatsApp';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturanSitus();

  const title = (pengaturan.seo_judul as string) || (pengaturan.nama_brand as string) || 'PARABOT';
  const description =
    (pengaturan.seo_deskripsi as string) ||
    (pengaturan.tagline_brand as string) ||
    'Etalase Produk Digital & Solusi Aplikasi';
  const ogImage = (pengaturan.seo_og_gambar as string) || '/og-image.png';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://parabot.id'),
    title: {
      default: title,
      template: `%s | ${(pengaturan.nama_brand as string) || 'PARABOT'}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pengaturan = await getPengaturanSitus();

  return (
    <html lang="id" className={plusJakartaSans.variable} data-scroll-behavior="smooth">
      <head>
        {/* Injeksi Variabel CSS Warna Aksen Dinamis dari Database */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --warna-aksen: ${(pengaturan.warna_aksen as string) || '#2563EB'};
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
        <RootClientLayout>{children}</RootClientLayout>
        <FloatingWhatsApp nomorWhatsApp={pengaturan.kontak_whatsapp as string} />
      </body>
    </html>
  );
}
