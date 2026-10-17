import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderGit2,
  Sliders,
  FileText,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface AdminNavProps {
  currentPath?: string;
}

export default function AdminNav({ currentPath = '/admin' }: AdminNavProps) {
  const menus = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Kelola Karya', href: '/admin/karya', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Pengaturan Situs', href: '/admin/pengaturan', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Halaman Statis', href: '/admin/halaman', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-slate-700 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PARABOT" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-tight">PARABOT</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Panel Kelola
              </span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            title="Lihat Situs Publik"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          {menus.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-slate-800/50 text-[11px] text-slate-400">
          <div className="font-bold text-slate-300">Bangkit Beruang Dev</div>
          <div className="text-[10px] text-emerald-400 font-mono">Role: Administrator</div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
