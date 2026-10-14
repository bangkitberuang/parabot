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
