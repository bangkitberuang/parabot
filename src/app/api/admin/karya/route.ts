import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper slug generator
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

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

    if (!nama || !jenis) {
      return NextResponse.json(
        { error: 'Nama karya dan jenis karya wajib diisi' },
        { status: 400 }
      );
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(nama);

    // 1. Simpan Karya ke tabel karya
    const insertPayload: Record<string, unknown> = {
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
    let { data: karyaData, error: karyaError } = await (supabase.from('karya') as any)
      .insert(insertPayload)
      .select('id, slug')
      .single();

    // Fallback otomatis jika kolom youtube_title belum ada di skema tabel Supabase
    if (karyaError && karyaError.message?.includes('youtube_title')) {
      delete insertPayload.youtube_title;
      const retryResult = await (supabase.from('karya') as any)
        .insert(insertPayload)
        .select('id, slug')
        .single();
      karyaData = retryResult.data;
      karyaError = retryResult.error;
    }

    if (karyaError || !karyaData) {
      throw new Error(karyaError?.message || 'Gagal menyimpan karya');
    }

    const savedId = karyaData.id;
    const savedSlug = karyaData.slug;

    // 2. Simpan Screenshots / Thumbnail jika ada
    if (Array.isArray(screenshots) && screenshots.length > 0) {
      const screenshotRows = screenshots
        .filter((s: { url?: string }) => s.url)
        .map((s: { url: string; keterangan?: string }, index: number) => ({
          karya_id: savedId,
          url: s.url,
          keterangan: s.keterangan || (index === 0 ? 'desktop' : 'mobile'),
          urutan: index + 1,
        }));

      if (screenshotRows.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('karya_screenshot') as any).insert(screenshotRows);
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/karya/${savedSlug}`, 'page');

    return NextResponse.json({ success: true, id: savedId, slug: savedSlug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
