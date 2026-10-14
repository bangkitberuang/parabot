import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDriveDownloadUrl } from '@/lib/utils/drive';

interface UnduhanQueryResult {
  url_drive: string;
  karya_id: string;
  karya: { status: string } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID unduhan diperlukan' }, { status: 400 });
  }

  const supabase = await createClient();

  // 1. Ambil URL drive dan verifikasi status karya
  const { data, error } = await supabase
    .from('karya_unduhan')
    .select('url_drive, karya_id, karya(status)')
    .eq('id', id)
    .single();

  const unduhan = data as unknown as UnduhanQueryResult | null;

  if (error || !unduhan || unduhan.karya?.status !== 'published') {
    return NextResponse.json({ error: 'Unduhan tidak ditemukan' }, { status: 404 });
  }

  // 2. Tambah klik via RPC aman (SECURITY DEFINER)
  try {
    const { error: rpcError } = await (supabase.rpc as unknown as (
      name: string,
      args: { p_unduhan_id: string }
    ) => Promise<{ error: unknown }>)('tambah_klik_unduhan', { p_unduhan_id: id });
    if (rpcError) {
      console.error('RPC error:', rpcError);
    }
  } catch (err) {
    console.error('Gagal mencatat statistik klik:', err);
  }

  // 3. Konversi link Google Drive menjadi link unduh langsung
  const directDownloadUrl = getDriveDownloadUrl(unduhan.url_drive);

  // 4. Redirect pengguna langsung ke unduhan
  return NextResponse.redirect(directDownloadUrl, { status: 302 });
}
