import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Proteksi sederhana agar revalidation hanya bisa dipanggil server terotorisasi
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Tidak memiliki izin' }, { status: 401 });
    }

    const body = await request.json();
    const path = body.path || '/';

    revalidatePath(path);
    if (body.paths && Array.isArray(body.paths)) {
      body.paths.forEach((p: string) => revalidatePath(p));
    }

    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ error: 'Gagal melakukan revalidasi' }, { status: 500 });
  }
}
