"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateGuestSlug, formatGuestName } from "@/lib/utils";
import { WEDDING } from "@/lib/config";

const BASE_URL = "https://undangan-pernikahan-yogadansaylun.vercel.app";

interface GeneratedItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function GenerateLinkPage() {
  const [guestName, setGuestName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [history, setHistory] = useState<GeneratedItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wedding_generated_links");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const slug = generateGuestSlug(guestName);
  const generatedUrl = guestName.trim() ? `${BASE_URL}/?to=${slug}` : "";
  const displayName = formatGuestName(slug);

  const whatsappMessage = `Kepada Yth.
*${displayName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

💍 *The Wedding of ${WEDDING.groom.nickname} & ${WEDDING.bride.nickname}*

Berikut tautan undangan digital kami:
${generatedUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
_${WEDDING.groom.nickname} & ${WEDDING.bride.nickname}_`;

  function handleSaveToHistory() {
    if (!guestName.trim()) return;
    const newItem: GeneratedItem = {
      id: Date.now().toString(),
      name: guestName.trim(),
      url: generatedUrl,
      createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [newItem, ...history.filter((h) => h.name.toLowerCase() !== guestName.trim().toLowerCase())].slice(0, 30);
    setHistory(updated);
    try {
      localStorage.setItem("wedding_generated_links", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  async function handleCopyLink(urlToCopy?: string) {
    const target = urlToCopy || generatedUrl;
    if (!target) return;
    await navigator.clipboard.writeText(target);
    setCopiedLink(true);
    handleSaveToHistory();
    setTimeout(() => setCopiedLink(false), 2500);
  }

  async function handleCopyMessage() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    handleSaveToHistory();
    setTimeout(() => setCopiedMessage(false), 2500);
  }

  function handleClearHistory() {
    if (confirm("Hapus semua riwayat link yang telah dibuat?")) {
      setHistory([]);
      localStorage.removeItem("wedding_generated_links");
    }
  }

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center justify-center"
      style={{ background: "var(--ivory-warm)" }}
    >
      <div className="w-full max-w-xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--gold)] hover:underline mb-3"
          >
            ← Kembali ke Undangan
          </Link>
          <span className="label">Generator Undangan</span>
          <h1 className="display text-3xl sm:text-4xl text-[var(--ink)] mt-2">
            Link Tamu Personal
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-2 font-light max-w-md">
            Buat tautan personal khusus untuk setiap tamu agar nama mereka tampil otomatis di halaman sampul.
          </p>
        </div>

        {/* Generator Card */}
        <div className="glass-card p-6 sm:p-8 flex flex-col gap-5">
          {/* Input Nama Tamu */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-2 font-sans">
              Nama Tamu / Keluarga
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Bapak Ahmad Fauzi / Abdul / Sarah & Keluarga"
              className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-white border border-[var(--gold)]/30 text-[var(--ink)] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 focus:border-[var(--gold)] transition-all min-h-[48px]"
              autoFocus
            />
            <p className="text-[11px] text-[var(--ink-muted)] mt-1.5 font-light">
              Spasi akan otomatis diubah menjadi tanda strip (-) pada link URL.
            </p>
          </div>

          {/* Result Section (when name is filled) */}
          {guestName.trim() && (
            <div className="flex flex-col gap-4 p-4.5 rounded-xl border border-[var(--gold)]/25 bg-white/70">
              
              {/* Preview Target */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Preview Tampilan di Cover:
                </span>
                <p className="font-serif text-lg text-[var(--ink)] font-medium">
                  Kepada Yth. <span className="underline decoration-[var(--gold)]">{displayName}</span>
                </p>
              </div>

              {/* Generated URL */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Link Khusus Tamu:
                </span>
                <div className="p-3 rounded-lg bg-neutral-100/90 text-xs font-mono text-[var(--ink-soft)] break-all border border-neutral-200">
                  {generatedUrl}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => handleCopyLink()}
                  className="py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {copiedLink ? "✓ Link Tersalin!" : "Salin Link Saja"}
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all text-[var(--ink)] bg-white hover:bg-neutral-50 border border-[var(--gold)]/30 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {copiedMessage ? "✓ Teks WA Tersalin!" : "Salin Format WA"}
                </button>
              </div>

              {/* Direct WhatsApp Share Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSaveToHistory}
                className="py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all text-white bg-[#25D366] hover:bg-[#20ba59] shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                Buka &amp; Kirim via WhatsApp
              </a>

              {/* Preview Link in Browser */}
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-[var(--gold)] hover:underline pt-1"
              >
                Test Buka Undangan Ini di Tab Baru ↗
              </a>
            </div>
          )}
        </div>

        {/* History List Card */}
        {history.length > 0 && (
          <div className="glass-card p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="label">Riwayat Link yang Dibuat ({history.length})</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] text-red-600 hover:underline cursor-pointer"
              >
                Hapus Riwayat
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scroll-elegant">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/80 border border-[var(--gold)]/20 text-xs"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[var(--ink)] truncate">{item.name}</span>
                    <span className="text-[10px] text-[var(--ink-muted)] truncate font-mono">{item.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(item.url)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--gold-pale)] text-[var(--gold)] font-medium hover:bg-[var(--gold)] hover:text-white transition-all shrink-0 cursor-pointer text-xs"
                  >
                    Salin
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
