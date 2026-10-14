import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const pathname = req.nextUrl.pathname;

  // Hanya periksa rute yang berawalan /admin
  if (!pathname.startsWith('/admin')) {
    return response;
  }

  // Izinkan akses bebas ke halaman login admin
  if (pathname === '/admin/login') {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Ambil user aktif dari sesi Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, redirect ke /admin/login
  if (!user) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verifikasi apakah email user terdaftar di tabel admin_email atau sesuai ADMIN_EMAIL di env
  const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@parabot.id').toLowerCase();
  const userEmail = (user.email || '').toLowerCase();

  const isEnvAdmin = userEmail === envAdminEmail;

  if (!isEnvAdmin) {
    const { data: adminRecord } = await supabase
      .from('admin_email')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();

    if (!adminRecord) {
      // User login tapi bukan admin terdaftar
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
