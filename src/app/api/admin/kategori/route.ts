import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// GET: Ambil daftar kategori
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('kategori')
      .select('id, nama, slug, urutan, aktif')
      .order('urutan', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil kategori';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Tambah kategori baru
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
    const { nama, slug, urutan, aktif } = body;

    if (!nama || !nama.trim()) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
    }

    const finalSlug = slug?.trim() ? generateSlug(slug) : generateSlug(nama);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('kategori') as any)
      .insert({
        nama: nama.trim(),
        slug: finalSlug,
        urutan: typeof urutan === 'number' ? urutan : 0,
        aktif: aktif ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menambah kategori';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Hapus kategori
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID kategori diperlukan' }, { status: 400 });
    }

    const { error } = await supabase.from('kategori').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus kategori';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
