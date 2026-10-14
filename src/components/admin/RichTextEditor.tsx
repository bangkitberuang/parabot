'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Code,
  Eye,
  Edit3,
  Columns,
  Undo,
  Redo,
  Sparkles,
} from 'lucide-react';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tuliskan teks di sini...',
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'split' | 'preview'>('edit');
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync value to history
  const updateValue = (newValue: string) => {
    onChange(newValue);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  // Helper untuk format teks seleksi
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${prefix}${selectedText}${suffix}`;
    const updated = `${before}${replacement}${after}`;

    updateValue(updated);

    // Set cursor selection kembali ke posisi teks
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);

    // Cari awal baris
    const lastNewline = before.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const lineBefore = value.substring(0, lineStart);
    const lineContent = value.substring(lineStart);

    const updated = `${lineBefore}${prefix} ${lineContent}`;
    updateValue(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 1, start + prefix.length + 1);
    }, 10);
  };

  const insertLink = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://google.com):');
    if (!url) return;
    insertFormatting('[', `](${url})`, 'Teks Tautan');
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar langsung:');
    if (!url) return;
    const alt = prompt('Keterangan gambar (alt text):') || 'Gambar';
    insertFormatting(`![${alt}](`, `)`, url);
  };

  // Render HTML preview yang 100% identik dengan tampilan di frontend
  const previewHtml = React.useMemo(() => {
    const raw = marked.parse(value || '', { async: false }) as string;
    return sanitizeHtml(raw, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'code', 'pre', 'hr',
        'u', 's', 'del', 'strike', 'sub', 'sup', 'mark', 'span', 'div',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote'
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
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
    });
  }, [value]);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
      {/* TOOLBAR ATAS (WYSIWYG CONTROL) */}
      <div className="bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <button
            type="button"
            title="Urungkan (Undo)"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Ulangi (Redo)"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1" />

          {/* Gaya Teks (Heading) */}
          <button
            type="button"
            title="Judul Utama (H1)"
            onClick={() => insertLinePrefix('#')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-black text-xs transition"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Subjudul Besar (H2)"
            onClick={() => insertLinePrefix('##')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Subjudul Sedang (H3)"
            onClick={() => insertLinePrefix('###')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1" />

          {/* Formatting Font (Bold, Italic, Underline, Strike) */}
          <button
            type="button"
            title="Tebal / Bold (**teks**)"
            onClick={() => insertFormatting('**', '**', 'teks tebal')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Miring / Italic (*teks*)"
            onClick={() => insertFormatting('*', '*', 'teks miring')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Garis Bawah (<u>teks</u>)"
            onClick={() => insertFormatting('<u>', '</u>', 'teks bergaris bawah')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Coret / Strikethrough (~~teks~~)"
            onClick={() => insertFormatting('~~', '~~', 'teks coret')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1" />

          {/* List & Quotes */}
          <button
            type="button"
            title="Daftar Poin (Bullet List)"
            onClick={() => insertLinePrefix('-')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Daftar Angka (Numbered List)"
            onClick={() => insertLinePrefix('1.')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Kutipan / Blockquote"
            onClick={() => insertLinePrefix('>')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Garis Pemisah (Horizontal Line)"
            onClick={() => insertFormatting('\n---\n')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1" />

          {/* Media & Link */}
          <button
            type="button"
            title="Sisipkan Tautan (Link)"
            onClick={insertLink}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-emerald-700 transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Sisipkan Gambar"
            onClick={insertImage}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-emerald-700 transition"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Blok Kode"
            onClick={() => insertFormatting('```\n', '\n```', 'kode')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* MODE TAMPILAN: EDIT, DUA LAYAR (SPLIT), ATAU PRATINJAU LANGSUNG */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeTab === 'edit'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeTab === 'split'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dua Kolom</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeTab === 'preview'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Hasil</span>
          </button>
        </div>
      </div>

      {/* AREA KONTEN */}
      <div className="relative">
        {/* TAB EDIT HANYA */}
        {activeTab === 'edit' && (
          <textarea
            ref={textareaRef}
            rows={16}
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 sm:p-5 text-sm leading-relaxed text-slate-800 font-sans focus:outline-none resize-y min-h-[360px]"
          />
        )}

        {/* TAB DUA KOLOM (SPLIT SCREEN WYSIWYG) */}
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[380px]">
            <div className="p-2 sm:p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Kolom Input Teks & Format
              </span>
              <textarea
                ref={textareaRef}
                rows={16}
                value={value}
                onChange={(e) => updateValue(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 text-sm leading-relaxed text-slate-800 font-sans focus:outline-none resize-none h-[350px]"
              />
            </div>
            <div className="p-4 sm:p-6 bg-slate-50/50 overflow-y-auto max-h-[420px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Pratinjau Hasil Tepat Sesuai Halaman Publik</span>
              </span>
              <div
                className="prose max-w-none text-sm leading-relaxed bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}

        {/* TAB PREVIEW LANGSUNG */}
        {activeTab === 'preview' && (
          <div className="p-6 sm:p-8 bg-slate-50/40 min-h-[360px]">
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-4">
                Pratinjau Format Bersih
              </span>
              <div
                className="prose max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER EDITOR */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span>Mendukung: <b>Tebal</b>, <i>Miring</i>, <u>Garis Bawah</u>, Paragraf Bebas, Heading, List, Link, & Gambar.</span>
        </div>
        <div>
          <span>{value.length} karakter</span>
        </div>
      </div>
    </div>
  );
}
