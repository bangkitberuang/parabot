'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('error') === 'unauthorized') {
        return 'Akun Anda belum terdaftar sebagai administrator di sistem (tabel admin_email).';
      }
    }
    return '';
  });

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const supabase = createClient();

      if (isRegisterMode) {
        // Mode Inisialisasi / Buat Akun Admin Baru
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setErrorMessage(error.message || 'Gagal mendaftarkan akun admin.');
          setLoading(false);
          return;
        }

        if (data?.session) {
          // Jika auto-confirm aktif di Supabase, langsung login
          const searchParams = new URLSearchParams(window.location.search);
          const destination = searchParams.get('redirect') || '/admin';
          window.location.href = destination;
          return;
        } else {
          setSuccessMessage(
            'Akun berhasil dibuat! Silakan coba masuk sekarang menggunakan password tersebut.'
          );
          setIsRegisterMode(false);
          setLoading(false);
          return;
        }
      }

      // Mode Masuk (Login)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? 'Email atau kata sandi tidak cocok. Belum membuat akun? Klik tab "Buat Akun Admin" di atas.'
            : error.message || 'Login gagal.'
        );
        setLoading(false);
        return;
      }

      if (data?.user) {
        const searchParams = new URLSearchParams(window.location.search);
        const destination = searchParams.get('redirect') || '/admin';
        window.location.href = destination;
      } else {
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kendala koneksi ke server.';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#032219] via-[#052E22] to-slate-900 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-md overflow-hidden p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PARABOT" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel Kelola PARABOT
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Masuk untuk mengatur karya, tagline, logo, banner, dan warna situs secara mandiri.
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Buat Akun Baru */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegisterMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegisterMode
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            + Buat Akun Admin
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parabot.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Kata Sandi {isRegisterMode && '(Minimal 6 karakter)'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Daftarkan Akun Admin' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
