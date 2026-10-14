import React from 'react';
import Link from 'next/link';
import { Code2 } from 'lucide-react';

interface FooterProps {
  brandName?: string;
  footerText?: string;
  disclaimer?: string;
  tautanSosial?: Array<{ platform: string; label: string; url: string }>;
  bannerUrl?: string;
  bannerPosisi?: string;
  bannerOpacity?: number;
}

export default function Footer({
  brandName = 'PARABOT',
  footerText = 'Koleksi aplikasi dan dokumentasi rekayasa digital mandiri oleh Bangkit Beruang Dev.',
  disclaimer = '© 2026 PARABOT. Dibangun dengan rasa ingin tahu dan dedikasi belajar.',
  tautanSosial = [],
  bannerUrl = '/gedung-sate-wide.png',
  bannerPosisi = 'center top',
  bannerOpacity = 60,
}: FooterProps) {
  const opacityVal = (bannerOpacity ?? 60) / 100;

  return (
    <footer className="relative bg-brand-darkest text-slate-400 pt-28 pb-16 border-t border-brand-dark overflow-hidden">
      {/* Latar Ilustrasi Gedung Sate Panorama (Posisi & Opasitas Dinamis dari Database) */}
      {bannerUrl && (
        <div
          className="absolute inset-x-0 top-0 h-72 sm:h-80 bg-no-repeat bg-cover pointer-events-none transition-all duration-300"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundPosition: bannerPosisi || 'center top',
            opacity: opacityVal,
          }}
        />
      )}

      {/* Lapisan Tint Gradasi agar Konten Footer Tetap Bersih & Teks Kontras */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-darkest/40 via-brand-darkest/90 to-brand-darkest pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-emerald/30 flex items-center justify-center text-brand-primary font-bold">
              <Code2 className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">{brandName}</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-400">Tatar Pasundan · Jawa Barat</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-sm leading-relaxed mb-4">
            {footerText}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs mb-6">
            <span>✨</span>
            <span className="italic font-medium">Silih Asah, Silih Asih, Silih Asuh</span>
          </div>
          <div className="text-xs text-slate-400">
            {disclaimer}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navigasi</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-brand-primary transition">Beranda</Link></li>
            <li><Link href="/#katalog" className="hover:text-brand-primary transition">Koleksi Karya</Link></li>
            <li><Link href="/#katalog-diy" className="hover:text-brand-primary transition">Proyek DIY</Link></li>
            <li><Link href="/tentang" className="hover:text-brand-primary transition">Tentang Pembuat</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Tautan</h4>
          <ul className="space-y-2.5 text-sm">
            {tautanSosial.length > 0 ? (
              tautanSosial.map((sosial, idx) => (
                <li key={idx}>
                  <a
                    href={sosial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-primary transition"
                  >
                    {sosial.label}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">GitHub</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">LinkedIn</a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
