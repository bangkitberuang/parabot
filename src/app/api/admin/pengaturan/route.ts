import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Verifikasi sesi admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { pengaturan } = body as { pengaturan: Record<string, unknown> };

    if (!pengaturan || typeof pengaturan !== 'object') {
      return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 });
    }

    // Update setiap kunci pengaturan
    const updates = Object.entries(pengaturan).map(([kunci, nilai]) =>
      supabase
        .from('pengaturan_situs')
        .upsert(
          {
            kunci,
            nilai: JSON.stringify(nilai),
            diperbarui_pada: new Date().toISOString(),
          },
          { onConflict: 'kunci' }
        )
    );

    await Promise.all(updates);

    // Revalidasi cache halaman publik secara instan
    revalidatePath('/', 'layout');
    revalidatePath('/tentang', 'page');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui pengaturan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
