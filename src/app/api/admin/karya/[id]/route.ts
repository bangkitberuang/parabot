import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(text: string): string {
  let clean = text.trim();

  // Jika input berupa URL lengkap (misal: https://galur.kitt.lt atau https://domain/karya/galur)
  if (/^https?:\/\//i.test(clean)) {
    try {
      const url = new URL(clean);
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        clean = segments[segments.length - 1];
      } else {
        const hostParts = url.hostname.split('.');
        clean = hostParts[0] === 'www' ? (hostParts[1] || 'karya') : hostParts[0];
      }
    } catch {
      clean = clean.replace(/^https?:\/\//i, '');
    }
  }

  // Jika terlanjur tersimpan pola https...kittlt
  if (clean.startsWith('https') && clean.endsWith('kittlt')) {
    clean = clean.replace(/^https/i, '').replace(/kittlt$/i, '');
  }

  return clean
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      nama,
      slug,
      tagline,
      jenis,
      kategori_id,
      deskripsi,
      cara_penggunaan,
      url_utama,
      url_repositori,
      youtube_title,
      youtube_url,
      versi,
      platform,
      status,
      unggulan,
      urutan,
      tingkat_kesulitan,
      estimasi_waktu,
      teknologi,
      screenshots,
    } = body;

    const finalSlug = slug ? generateSlug(slug) : generateSlug(nama);

    // 1. Update data utama karya
    const updatePayload: Record<string, unknown> = {
      nama,
      slug: finalSlug,
      tagline: tagline || null,
      jenis,
      kategori_id: kategori_id || null,
      deskripsi: deskripsi || null,
      cara_penggunaan: cara_penggunaan || null,
      url_utama: url_utama || null,
      url_repositori: url_repositori || null,
      youtube_title: youtube_title || null,
      youtube_url: youtube_url || null,
      versi: versi || 'v1.0.0',
      platform: platform || null,
      status: status || 'published',
      unggulan: Boolean(unggulan),
      urutan: typeof urutan === 'number' ? urutan : 0,
      tingkat_kesulitan: tingkat_kesulitan || null,
      estimasi_waktu: estimasi_waktu || null,
      teknologi: Array.isArray(teknologi) ? teknologi : [],
      diperbarui_pada: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { data: updatedKarya, error: updateError } = await (supabase.from('karya') as any)
      .update(updatePayload)
      .eq('id', id)
      .select('id, slug')
      .single();

    // Fallback otomatis jika kolom youtube_title belum ada di skema tabel Supabase
    if (updateError && updateError.message?.includes('youtube_title')) {
      delete updatePayload.youtube_title;
      const retryResult = await (supabase.from('karya') as any)
        .update(updatePayload)
        .eq('id', id)
        .select('id, slug')
        .single();
      updatedKarya = retryResult.data;
      updateError = retryResult.error;
    }

    if (updateError || !updatedKarya) {
      throw new Error(updateError?.message || 'Gagal memperbarui karya');
    }

    const savedSlug = updatedKarya.slug;

    // 2. Perbarui screenshots/thumbnails jika dikirim
    if (Array.isArray(screenshots)) {
      // Hapus yang lama, ganti dengan yang baru
      await supabase.from('karya_screenshot').delete().eq('karya_id', id);

      const validScreenshots = screenshots.filter((s: { url?: string }) => s.url);
      if (validScreenshots.length > 0) {
        const rows = validScreenshots.map((s: { url: string; keterangan?: string }, index: number) => ({
          karya_id: id,
          url: s.url,
          keterangan: s.keterangan || (index === 0 ? 'desktop' : 'mobile'),
          urutan: index + 1,
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('karya_screenshot') as any).insert(rows);
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/karya/${savedSlug}`, 'page');

    return NextResponse.json({ success: true, slug: savedSlug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase.from('karya').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus karya';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
