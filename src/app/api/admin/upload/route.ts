import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'logos';

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validasi tipe file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file harus berupa PNG, JPG, WEBP, atau SVG' },
        { status: 400 }
      );
    }

    // Validasi ukuran maks 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik yang bersih
    const ext = path.extname(file.name) || (file.type === 'image/svg+xml' ? '.svg' : '.png');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Coba upload ke Supabase Storage bucket 'aset-parabot' terlebih dahulu
    const storagePath = `${folder}/${safeName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('aset-parabot')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from('aset-parabot')
        .getPublicUrl(storagePath);

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        filename: safeName,
      });
    }

    // Jika bucket storage di Supabase belum dibuat, fallback otomatis ke public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadsDir, { recursive: true });
    const localFilePath = path.join(uploadsDir, safeName);
    await writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeName}`;

    return NextResponse.json({
      url: publicUrl,
      filename: safeName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengunggah file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
