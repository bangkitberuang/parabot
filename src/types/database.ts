export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type JenisKarya = 'web' | 'mobile' | 'unduhan' | 'diy';
export type StatusKarya = 'published' | 'hidden' | 'draft';
export type PlatformUnduhan = 'windows' | 'android' | 'ios' | 'mac' | 'linux' | 'lainnya' | 'berkas';
export type KodeBagianBeranda =
  | 'hero'
  | 'dibangun_dengan'
  | 'karya_terbaru'
  | 'unggulan'
  | 'panel_angka'
  | 'cara_berkarya'
  | 'ekosistem'
  | 'cta';

export interface Database {
  public: {
    Tables: {
      admin_email: {
        Row: {
          id: string;
          email: string;
          dibuat_pada: string;
        };
        Insert: {
          id?: string;
          email: string;
          dibuat_pada?: string;
        };
        Update: {
          id?: string;
          email?: string;
          dibuat_pada?: string;
        };
        Relationships: [];
      };
      kategori: {
        Row: {
          id: string;
          nama: string;
          slug: string;
          urutan: number;
          aktif: boolean;
          dibuat_pada: string;
          diperbarui_pada: string;
        };
        Insert: {
          id?: string;
          nama: string;
          slug: string;
          urutan?: number;
          aktif?: boolean;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          slug?: string;
          urutan?: number;
          aktif?: boolean;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Relationships: [];
      };
      karya: {
        Row: {
          id: string;
          slug: string;
          nama: string;
          tagline: string | null;
          jenis: JenisKarya;
          kategori_id: string | null;
          deskripsi: string | null;
          cara_penggunaan: string | null;
          url_utama: string | null;
          url_repositori: string | null;
          youtube_title: string | null;
          youtube_url: string | null;
          versi: string;
          platform: string | null;
          ikon_url: string | null;
          status: StatusKarya;
          unggulan: boolean;
          urutan: number;
          tingkat_kesulitan: string | null;
          estimasi_waktu: string | null;
          bahan_alat: Json | null;
          teknologi: string[];
          tanggal_rilis: string;
          diperbarui_pada: string;
          dibuat_pada: string;
        };
        Insert: {
          id?: string;
          slug?: string;
          nama: string;
          tagline?: string | null;
          jenis?: JenisKarya;
          kategori_id?: string | null;
          deskripsi?: string | null;
          cara_penggunaan?: string | null;
          url_utama?: string | null;
          url_repositori?: string | null;
          youtube_title?: string | null;
          youtube_url?: string | null;
          versi?: string;
          platform?: string | null;
          ikon_url?: string | null;
          status?: StatusKarya;
          unggulan?: boolean;
          urutan?: number;
          tingkat_kesulitan?: string | null;
          estimasi_waktu?: string | null;
          bahan_alat?: Json | null;
          teknologi?: string[];
          tanggal_rilis?: string;
          diperbarui_pada?: string;
          dibuat_pada?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          nama?: string;
          tagline?: string | null;
          jenis?: JenisKarya;
          kategori_id?: string | null;
          deskripsi?: string | null;
          cara_penggunaan?: string | null;
          url_utama?: string | null;
          url_repositori?: string | null;
          youtube_title?: string | null;
          youtube_url?: string | null;
          versi?: string;
          platform?: string | null;
          ikon_url?: string | null;
          status?: StatusKarya;
          unggulan?: boolean;
          urutan?: number;
          tingkat_kesulitan?: string | null;
          estimasi_waktu?: string | null;
          bahan_alat?: Json | null;
          teknologi?: string[];
          tanggal_rilis?: string;
          diperbarui_pada?: string;
          dibuat_pada?: string;
        };
        Relationships: [];
      };
      karya_screenshot: {
        Row: {
          id: string;
          karya_id: string;
          url: string;
          keterangan: string | null;
          urutan: number;
          dibuat_pada: string;
        };
        Insert: {
          id?: string;
          karya_id: string;
          url: string;
          keterangan?: string | null;
          urutan?: number;
          dibuat_pada?: string;
        };
        Update: {
          id?: string;
          karya_id?: string;
          url?: string;
          keterangan?: string | null;
          urutan?: number;
          dibuat_pada?: string;
        };
        Relationships: [];
      };
      karya_unduhan: {
        Row: {
          id: string;
          karya_id: string;
          label: string;
          platform: PlatformUnduhan;
          url_drive: string;
          ukuran_teks: string | null;
          urutan: number;
          jumlah_klik: number;
          dibuat_pada: string;
          diperbarui_pada: string;
        };
        Insert: {
          id?: string;
          karya_id: string;
          label: string;
          platform?: PlatformUnduhan;
          url_drive: string;
          ukuran_teks?: string | null;
          urutan?: number;
          jumlah_klik?: number;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Update: {
          id?: string;
          karya_id?: string;
          label?: string;
          platform?: PlatformUnduhan;
          url_drive?: string;
          ukuran_teks?: string | null;
          urutan?: number;
          jumlah_klik?: number;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Relationships: [];
      };
      pengaturan_situs: {
        Row: {
          kunci: string;
          nilai: Json;
          keterangan: string | null;
          diperbarui_pada: string;
        };
        Insert: {
          kunci: string;
          nilai: Json;
          keterangan?: string | null;
          diperbarui_pada?: string;
        };
        Update: {
          kunci?: string;
          nilai?: Json;
          keterangan?: string | null;
          diperbarui_pada?: string;
        };
        Relationships: [];
      };
      menu_navigasi: {
        Row: {
          id: string;
          label: string;
          href: string;
          urutan: number;
          tampil: boolean;
          dibuat_pada: string;
        };
        Insert: {
          id?: string;
          label: string;
          href: string;
          urutan?: number;
          tampil?: boolean;
          dibuat_pada?: string;
        };
        Update: {
          id?: string;
          label?: string;
          href?: string;
          urutan?: number;
          tampil?: boolean;
          dibuat_pada?: string;
        };
        Relationships: [];
      };
      bagian_beranda: {
        Row: {
          id: string;
          kode: KodeBagianBeranda;
          judul: string | null;
          subjudul: string | null;
          konten: Json;
          urutan: number;
          tampil: boolean;
          diperbarui_pada: string;
        };
        Insert: {
          id?: string;
          kode: KodeBagianBeranda;
          judul?: string | null;
          subjudul?: string | null;
          konten?: Json;
          urutan?: number;
          tampil?: boolean;
          diperbarui_pada?: string;
        };
        Update: {
          id?: string;
          kode?: KodeBagianBeranda;
          judul?: string | null;
          subjudul?: string | null;
          konten?: Json;
          urutan?: number;
          tampil?: boolean;
          diperbarui_pada?: string;
        };
        Relationships: [];
      };
      halaman_statis: {
        Row: {
          id: string;
          slug: string;
          judul: string;
          isi: string;
          tampil: boolean;
          dibuat_pada: string;
          diperbarui_pada: string;
        };
        Insert: {
          id?: string;
          slug: string;
          judul: string;
          isi: string;
          tampil?: boolean;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          judul?: string;
          isi?: string;
          tampil?: boolean;
          dibuat_pada?: string;
          diperbarui_pada?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      karya_publik: {
        Row: {
          id: string;
          slug: string;
          nama: string;
          tagline: string | null;
          jenis: JenisKarya;
          kategori_id: string | null;
          kategori_nama: string | null;
          kategori_slug: string | null;
          deskripsi: string | null;
          cara_penggunaan: string | null;
          url_utama: string | null;
          url_repositori: string | null;
          youtube_title: string | null;
          youtube_url: string | null;
          versi: string;
          platform: string | null;
          ikon_url: string | null;
          status: StatusKarya;
          unggulan: boolean;
          urutan: number;
          tingkat_kesulitan: string | null;
          estimasi_waktu: string | null;
          bahan_alat: Json | null;
          teknologi: string[];
          tanggal_rilis: string;
          diperbarui_pada: string;
          dibuat_pada: string;
          screenshots: Json;
          unduhan: Json;
        };
        Relationships: [];
      };
    };
    Functions: {
      tambah_klik_unduhan: {
        Args: {
          p_unduhan_id: string;
        };
        Returns: number;
      };
    };
  };
}
