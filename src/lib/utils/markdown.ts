import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// Konfigurasi marked agar otomatis membuat baris baru (<br />) pada line break single
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'code', 'pre', 'hr',
      'u', 's', 'del', 'strike', 'sub', 'sup', 'mark', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'iframe'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: [
        'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
        'title', 'class', 'style', 'loading'
      ],
      img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
      a: ['href', 'name', 'target', 'rel', 'style', 'class'],
      p: ['style', 'class'],
      span: ['style', 'class'],
      div: ['style', 'class'],
      h1: ['style', 'class'],
      h2: ['style', 'class'],
      h3: ['style', 'class'],
      h4: ['style', 'class'],
      h5: ['style', 'class'],
      h6: ['style', 'class'],
      blockquote: ['style', 'class'],
      code: ['class', 'style'],
      th: ['style', 'class'],
      td: ['style', 'class'],
    },
    allowedStyles: {
      '*': {
        'color': [/.*/],
        'background-color': [/.*/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-size': [/.*/],
        'font-weight': [/.*/],
        'text-decoration': [/.*/],
        'margin': [/.*/],
        'padding': [/.*/],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
  });
}

/**
 * Membersihkan format Markdown menjadi teks polos untuk ringkasan kartu dan meta tag SEO
 */
export function stripMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return markdown
    .replace(/^#{1,6}\s+/gm, '') // Hapus header #
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Hapus bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Hapus italic
    .replace(/`([^`]+)`/g, '$1') // Hapus inline code
    .replace(/```[\s\S]*?```/g, '') // Hapus code block
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Hapus link [teks](url) -> teks
    .replace(/^\s*[-*+]\s+/gm, '') // Hapus bullet list
    .replace(/^\s*\d+\.\s+/gm, '') // Hapus numbered list
    .replace(/\n+/g, ' ') // Ganti newline dengan spasi
    .trim();
}

/**
 * Validasi apakah teks konten memiliki substansi nyata, bukan placeholder seperti 'WAIT..', 'TBD', '-'
 */
export function isMeaningfulContent(text: string | null | undefined): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length < 15) {
    if (/^(wait\.{0,4}|tbd|todo|-|n\/a|belum ada|coming soon|dummy|test)$/i.test(trimmed)) {
      return false;
    }
  }
  return true;
}
