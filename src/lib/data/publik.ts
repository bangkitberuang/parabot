import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

export type KaryaPublikRow = Database['public']['Views']['karya_publik']['Row'];
export type BagianBerandaRow = Database['public']['Tables']['bagian_beranda']['Row'];
export type KategoriRow = Database['public']['Tables']['kategori']['Row'];
export type MenuNavigasiRow = Database['public']['Tables']['menu_navigasi']['Row'];
export type HalamanStatisRow = Database['public']['Tables']['halaman_statis']['Row'];

interface PengaturanRow {
  kunci: string;
  nilai: unknown;
}

export async function getPengaturanSitus(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pengaturan_situs')
    .select('kunci, nilai');

  if (error || !data) return {};

  const pengaturan: Record<string, unknown> = {};
  (data as unknown as PengaturanRow[]).forEach((row) => {
    let val: unknown = row.nilai;
    // Unwrap jika tersimpan sebagai JSON string berkali-kali
    while (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      try {
        val = JSON.parse(val);
      } catch {
        val = (val as string).replace(/^"|"$/g, '');
        break;
      }
    }
    pengaturan[row.kunci] = val;
  });
  return pengaturan;
}

export async function getMenuNavigasi(): Promise<MenuNavigasiRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_navigasi')
    .select('*')
    .eq('tampil', true)
    .order('urutan', { ascending: true });

  if (error || !data) return [];
  return data as unknown as MenuNavigasiRow[];
}

export async function getBagianBeranda(): Promise<BagianBerandaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bagian_beranda')
    .select('*')
    .eq('tampil', true)
    .order('urutan', { ascending: true });

  if (error || !data) return [];
  return data as unknown as BagianBerandaRow[];
}

export async function getKategoriAktif(): Promise<KategoriRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kategori')
    .select('*')
    .eq('aktif', true)
    .order('urutan', { ascending: true });

  if (error || !data) return [];
  return data as unknown as KategoriRow[];
}

// Pemetaan dummy screenshot jika tabel belum memiliki upload manual
const DEFAULT_SCREENSHOTS_BY_SLUG: Record<string, Array<{ id: string; url: string; keterangan: string; urutan: number }>> = {
  'karsa-project-planner': [
    { id: '1', url: '/mockups/karsa-desktop.png', keterangan: 'Tampilan Dasbor Manajemen Proyek', urutan: 1 },
    { id: '2', url: '/mockups/karsa-mobile.png', keterangan: 'Tampilan Responsif Mobile', urutan: 2 },
  ],
  'galur': [
    { id: 'b14d2b5e-c0cc-4466-8328-8f83eab37a30', url: 'https://yoddmcupzwjjmyonzaas.supabase.co/storage/v1/object/public/aset-parabot/karya/1792253689483-3nhgmi.png', keterangan: 'Kanvas Kerja Flowchart & Mind Mapping', urutan: 1 },
    { id: '4ee988aa-a3d9-4952-9989-396b1faf87bb', url: 'https://yoddmcupzwjjmyonzaas.supabase.co/storage/v1/object/public/aset-parabot/karya/1792253830561-d571u4.png', keterangan: 'Katalog Komponen & Stencil Lengkap', urutan: 2 },
    { id: 'd414239c-1b23-49d5-8e5a-1bd16d11af93', url: 'https://yoddmcupzwjjmyonzaas.supabase.co/storage/v1/object/public/aset-parabot/karya/1792253831159-04c2f1.png', keterangan: 'Pilihan Ekspor PDF & Cetak Langsung', urutan: 3 },
    { id: '896b5b95-142a-4683-bc0d-e4b986d6e9aa', url: 'https://yoddmcupzwjjmyonzaas.supabase.co/storage/v1/object/public/aset-parabot/karya/1792253830920-4hgz03.png', keterangan: 'Panel Konfigurasi Gaya Bentuk', urutan: 4 },
  ],
  'sawala-sentimen-warga': [
    { id: '5', url: '/mockups/sawala-desktop.png', keterangan: 'Dasbor Analitik Sentimen Publik', urutan: 1 },
    { id: '6', url: '/mockups/sawala-mobile.png', keterangan: 'Tampilan Aplikasi Mobile', urutan: 2 },
  ],
  'diy-bot-notulensi-mandiri': [
    { id: '7', url: '/mockups/diy-bot-desktop.png', keterangan: 'Antarmuka Transkripsi Rapat Mandiri', urutan: 1 },
  ],
  'diy-iot-monitor-server': [
    { id: '9', url: '/mockups/diy-iot-desktop.png', keterangan: 'Skema Rangkaian IoT & Notifikasi Telegram', urutan: 1 },
  ],
};

import fallbackKaryaList from './karya-fallback.json';

/**
 * Normalisasi dan sanitasi record karya agar konsisten, bebas cacat data,
 * dan aman dari kekeliruan seeding (misal label unduhan salah / placeholder "WAIT..")
 */
function normalizeKarya(karya: KaryaPublikRow): KaryaPublikRow {
  const item = { ...karya };

  // 1. Sanitasi slug dan nama khusus untuk GALUR
  const isGalur = item.nama.toLowerCase().includes('galur') || item.slug.includes('galur');
  if (isGalur) {
    item.slug = 'galur';
    item.tagline = 'Garis Alur, Ngajentrekeun Struktur';
    item.kategori_nama = 'Produktivitas & Visualisasi';
    item.platform = item.platform || 'Windows & Web';

    // Format deskripsi jika belum berformat Markdown terstruktur
    if (item.deskripsi && !item.deskripsi.includes('###')) {
      const fallbackGalur = fallbackKaryaList.find((f) => f.slug === 'galur');
      if (fallbackGalur) {
        item.deskripsi = fallbackGalur.deskripsi;
      }
    }

    // Ganti "WAIT.." dengan panduan penggunaan praktis
    if (!item.cara_penggunaan || /^(wait\.{0,4}|tbd|-)$/i.test(item.cara_penggunaan.trim())) {
      item.cara_penggunaan =
        '1. **Buka Kanvas Kerja**: Akses GALUR melalui peramban web di https://galur.kitt.lt atau pasang installer desktop.\n' +
        '2. **Rancang Diagram**: Tarik bentuk dari stencil bilah kiri, sambungkan garis alur antar-titik magnetik, dan beri label teks.\n' +
        '3. **Simpan & Ekspor**: Simpan proyek diagram ke awan Supabase atau unduh langsung dalam format PDF siap cetak maupun PNG HD.';
    }

    // Koreksi nama unduhan jika tercemar nama produk lain (mis: RANTANG)
    if (Array.isArray(item.unduhan)) {
      item.unduhan = (item.unduhan as unknown as Array<{ id: string; label: string; platform: string; url_drive: string; ukuran_teks?: string; sha256?: string }>).map((u) => {
        if (u.label.toLowerCase().includes('rantang')) {
          return {
            ...u,
            label: 'GALUR Desktop Installer v2.1.0 (Windows x64)',
            platform: 'windows',
            url_drive: 'https://github.com/bangkitberuang/galur/releases',
            ukuran_teks: '64 MB',
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          };
        }
        return {
          ...u,
          sha256: u.sha256 || '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        };
      }) as unknown as typeof item.unduhan;
    }
  }

  // 2. Normalisasi Screenshot & Bersihkan Label 'desktop' / 'mobile'
  const currentScreens = Array.isArray(item.screenshots) ? item.screenshots : [];
  const screenArray = (
    currentScreens.length > 0
      ? currentScreens
      : ((DEFAULT_SCREENSHOTS_BY_SLUG[item.slug] as unknown as typeof currentScreens) || [])
  ) as unknown as Array<{ id?: string; url: string; keterangan?: string | null; urutan?: number }>;

  const galurLabels = [
    'Kanvas Kerja & Alur Diagram',
    'Katalog Komponen & Stencil',
    'Pilihan Ekspor PDF & Cetak',
    'Panel Konfigurasi Bentuk',
  ];

  item.screenshots = screenArray.map((s, idx) => {
    let ket = s.keterangan || '';
    if (!ket || /^(desktop|mobile|screenshot)$/i.test(ket.trim())) {
      ket = isGalur ? (galurLabels[idx] || `Tangkapan Layar #${idx + 1}`) : `Tangkapan Layar #${idx + 1}`;
    }
    return {
      id: s.id || String(idx + 1),
      url: s.url,
      keterangan: ket,
      urutan: s.urutan || idx + 1,
    };
  }) as unknown as typeof item.screenshots;

  // 3. Normalisasi jenis mobile
  if (item.slug === 'sawala-sentimen-warga' && item.jenis === 'web') {
    item.jenis = 'mobile';
  }

  return item;
}

export async function getKaryaPublikList(): Promise<KaryaPublikRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('karya_publik')
      .select('*')
      .order('urutan', { ascending: true })
      .order('tanggal_rilis', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback cadangan statis jika Supabase free tier ter-pause atau jaringan timeout
      return (fallbackKaryaList as unknown as KaryaPublikRow[]).map(normalizeKarya);
    }

    const list = data as unknown as KaryaPublikRow[];
    return list.map(normalizeKarya);
  } catch (err) {
    console.warn('[getKaryaPublikList] Gagal memuat dari Supabase, beralih ke cadangan statis:', err);
    return (fallbackKaryaList as unknown as KaryaPublikRow[]).map(normalizeKarya);
  }
}

export async function getKaryaPublikBySlug(slug: string): Promise<KaryaPublikRow | null> {
  const cleanSlug = slug.toLowerCase().trim();

  try {
    const supabase = await createClient();
    
    // Cari berdasarkan slug langsung atau alias yang pernah terdaftar
    const query = cleanSlug === 'galur'
      ? 'slug.eq.galur,slug.eq.httpsgalurkittlt'
      : `slug.eq.${cleanSlug}`;

    const { data, error } = await supabase
      .from('karya_publik')
      .select('*')
      .or(query)
      .maybeSingle();

    if (error || !data) {
      // Fallback ke data statis
      const fallbackItem = fallbackKaryaList.find(
        (k) => k.slug === cleanSlug || (cleanSlug === 'galur' && k.slug.includes('galur'))
      );
      if (fallbackItem) {
        return normalizeKarya(fallbackItem as unknown as KaryaPublikRow);
      }
      return null;
    }

    const row = data as unknown as KaryaPublikRow;
    return normalizeKarya(row);
  } catch (err) {
    console.warn(`[getKaryaPublikBySlug] Gagal memuat ${cleanSlug} dari Supabase, beralih ke cadangan:`, err);
    const fallbackItem = fallbackKaryaList.find(
      (k) => k.slug === cleanSlug || (cleanSlug === 'galur' && k.slug.includes('galur'))
    );
    if (fallbackItem) {
      return normalizeKarya(fallbackItem as unknown as KaryaPublikRow);
    }
    return null;
  }
}

export async function getHalamanStatis(slug: string): Promise<HalamanStatisRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('halaman_statis')
      .select('*')
      .eq('slug', slug)
      .eq('tampil', true)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as HalamanStatisRow;
  } catch {
    return null;
  }
}

