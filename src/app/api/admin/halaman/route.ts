import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { slug, judul, isi, tampil, banner_url, banner_posisi, banner_opacity } = body;

    if (!slug || !judul) {
      return NextResponse.json(
        { error: 'Slug dan judul halaman wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Simpan Konten Halaman Statis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('halaman_statis') as any)
      .upsert(
        {
          slug,
          judul,
          isi: isi || '',
          tampil: tampil ?? true,
          diperbarui_pada: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id, slug')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 2. Simpan Banner Halaman Tentang ke pengaturan_situs jika slug === 'tentang'
    if (slug === 'tentang') {
      const bannerUpdates = [
        { kunci: 'tentang_banner_url', nilai: JSON.stringify(banner_url || '') },
        { kunci: 'tentang_banner_posisi', nilai: JSON.stringify(banner_posisi || 'center center') },
        { kunci: 'tentang_banner_opacity', nilai: JSON.stringify(Number(banner_opacity) || 60) },
      ];

      for (const item of bannerUpdates) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('pengaturan_situs') as any).upsert(
          {
            kunci: item.kunci,
            nilai: item.nilai,
            diperbarui_pada: new Date().toISOString(),
          },
          { onConflict: 'kunci' }
        );
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/tentang', 'page');
    revalidatePath('/tentang');
    revalidatePath('/admin/halaman');

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
