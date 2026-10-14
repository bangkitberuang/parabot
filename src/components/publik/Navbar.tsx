'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';

interface NavbarProps {
  brandName?: string;
  brandTagline?: string;
  logoUrl?: string;
}

export default function Navbar({
  brandName = 'PARABOT',
  brandTagline = 'Portofolio Karya Digital · Bangkit Beruang Dev',
  logoUrl = '',
}: NavbarProps) {
  // 3 Menu Sesuai Persyaratan: Beranda, Karya, Tentang
  const menuList = [
    { label: 'Beranda', href: '/' },
    { label: 'Karya', href: '/#katalog' },
    { label: 'Tentang', href: '/tentang' },
  ];

  return (
    <nav className="relative z-50 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-emerald/30 flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={brandName}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <Code2 className="w-5 h-5 text-brand-primary" />
          )}
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
            {brandName}
          </span>
          <span className="text-[11px] font-medium tracking-wide text-brand-mint/80 block mt-1">
            {brandTagline}
          </span>
        </div>
      </Link>

      {/* 3 Menu: Beranda, Karya, Tentang */}
      <div className="hidden md:flex items-center gap-7 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-sm font-medium text-white/90">
        {menuList.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="hover:text-brand-primary transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Satu Tombol Aksi: Lihat Karya */}
      <div className="flex items-center gap-3">
        <Link
          href="/#katalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-spruce text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 min-h-[44px]"
        >
          <span>Lihat Karya</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>
    </nav>
  );
}
