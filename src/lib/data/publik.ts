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
    { id: '1', url: '/mockups/karsa-desktop.png', keterangan: 'desktop', urutan: 1 },
    { id: '2', url: '/mockups/karsa-mobile.png', keterangan: 'mobile', urutan: 2 },
  ],
  'rantang-berkas-gawe': [
    { id: '3', url: '/mockups/rantang-desktop.png', keterangan: 'desktop', urutan: 1 },
    { id: '4', url: '/mockups/rantang-mobile.png', keterangan: 'mobile', urutan: 2 },
  ],
  'sawala-sentimen-warga': [
    { id: '5', url: '/mockups/sawala-desktop.png', keterangan: 'desktop', urutan: 1 },
    { id: '6', url: '/mockups/sawala-mobile.png', keterangan: 'mobile', urutan: 2 },
  ],
  'diy-bot-notulensi-mandiri': [
    { id: '7', url: '/mockups/diy-bot-desktop.png', keterangan: 'desktop', urutan: 1 },
    { id: '8', url: '/mockups/diy-bot-mobile.png', keterangan: 'mobile', urutan: 2 },
  ],
  'diy-iot-monitor-server': [
    { id: '9', url: '/mockups/diy-iot-desktop.png', keterangan: 'desktop', urutan: 1 },
    { id: '10', url: '/mockups/diy-iot-mobile.png', keterangan: 'mobile', urutan: 2 },
  ],
};

function enrichKaryaScreenshots<T extends { slug: string; jenis?: unknown; screenshots?: unknown }>(karya: T): T {
  const current = Array.isArray(karya.screenshots) ? karya.screenshots : [];
  let item = { ...karya };
  if (current.length === 0 && DEFAULT_SCREENSHOTS_BY_SLUG[karya.slug]) {
    item = {
      ...item,
      screenshots: DEFAULT_SCREENSHOTS_BY_SLUG[karya.slug],
    };
  }
  // Tetapkan SAWALA sebagai contoh jenis 'mobile'
  if (karya.slug === 'sawala-sentimen-warga' && item.jenis === 'web') {
    item = {
      ...item,
      jenis: 'mobile' as unknown as T['jenis'],
    };
  }
  return item;
}

export async function getKaryaPublikList(): Promise<KaryaPublikRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('karya_publik')
    .select('*')
    .order('urutan', { ascending: true })
    .order('tanggal_rilis', { ascending: false });

  if (error || !data) return [];
  const list = data as unknown as KaryaPublikRow[];
  return list.map(enrichKaryaScreenshots);
}

export async function getKaryaPublikBySlug(slug: string): Promise<KaryaPublikRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('karya_publik')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as KaryaPublikRow;
  return enrichKaryaScreenshots(row);
}

export async function getHalamanStatis(slug: string): Promise<HalamanStatisRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('halaman_statis')
    .select('*')
    .eq('slug', slug)
    .eq('tampil', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as HalamanStatisRow;
}
