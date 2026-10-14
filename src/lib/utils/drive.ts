/**
 * Ekstraksi Google Drive File ID dari berbagai pola link:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  return null;
}

/**
 * Konversi URL Drive ke tautan unduh langsung (Direct Download)
 */
export function getDriveDownloadUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

/**
 * URL untuk opsi "Buka di Drive" (Pratinjau)
 */
export function getDrivePreviewUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return url;
}
