"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { WEDDING } from "@/lib/config";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Satu baris rekening di dalam card gabungan */
function BankRow({ bank, number, holder }: { bank: string; number: string; holder: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Bank label */}
      <div className="flex items-center justify-between">
        <span className="font-sans font-bold text-xs tracking-widest text-[var(--gold)] uppercase">
          Bank {bank}
        </span>
      </div>

      {/* Number + copy container */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border transition-all"
        style={{ 
          background: "rgba(255, 255, 255, 0.9)", 
          borderColor: "rgba(156, 119, 84, 0.3)" 
        }}
      >
        <span className="font-sans font-bold text-lg sm:text-xl tracking-[0.08em] text-[var(--ink)]">
          {number}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-all text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] shadow-xs cursor-pointer active:scale-95"
          title={`Salin nomor rekening ${bank}`}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                <CheckIcon />
                Tersalin!
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                <CopyIcon />
                Salin
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Holder */}
      <p className="font-sans text-[var(--ink-muted)] font-light text-xs text-center">
        Atas Nama: <span className="font-medium text-[var(--ink-soft)]">{holder}</span>
      </p>
    </div>
  );
}

export default function GiftSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="section-wrap"
      style={{ background: "var(--ivory-warm)" }}
    >
      {/* Header */}
      <motion.div
        ref={ref}
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Amplop Digital</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ color: "var(--ink)" }}>Hadiah Kasih Sayang</h2>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--ink-muted)",
            fontWeight: 300,
            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
            maxWidth: 400,
          }}
        >
          Doa restu Anda adalah hadiah yang paling berarti bagi kami.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 w-full items-center mt-4">

        {/* ── Satu card gabungan semua rekening ── */}
        <motion.div
          className="glass-card w-full max-w-[480px] p-6 sm:p-8 md:p-10 flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            <p className="label" style={{ color: "var(--gold)" }}>Transfer Bank</p>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          </div>

          <div className="w-full flex flex-col gap-6">
            {WEDDING.bankAccounts.map((acc, i) => (
              <div key={acc.bank} className="w-full flex flex-col gap-6">
                <BankRow bank={acc.bank} number={acc.number} holder={acc.holder} />
                {/* Divider antara rekening — kecuali yang terakhir */}
                {i < WEDDING.bankAccounts.length - 1 && (
                  <div className="hr-thin w-full" style={{ opacity: 0.4 }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Card kirim hadiah fisik ── */}
        <motion.div
          className="glass-card w-full max-w-[480px] p-6 sm:p-8 md:p-10 flex flex-col items-center text-center gap-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            <p className="label" style={{ color: "var(--gold)" }}>Kirim Hadiah Fisik</p>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          </div>
          <div className="hr-thin w-16 my-1" style={{ opacity: 0.5 }} />
          
          <div className="flex flex-col gap-1.5">
            <p className="font-sans text-[var(--ink)] font-semibold text-sm sm:text-base">
              Penerima: {WEDDING.groom.nickname} &amp; {WEDDING.bride.nickname}
            </p>
            <p className="font-sans text-[var(--ink-muted)] font-light text-xs sm:text-sm leading-relaxed max-w-sm">
              {WEDDING.akad.address}
            </p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(WEDDING.akad.address);
              alert("Alamat berhasil disalin!");
            }}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] shadow-xs mt-2 cursor-pointer active:scale-98"
            title="Salin Alamat Lengkap"
          >
            <CopyIcon />
            Salin Alamat Lengkap
          </button>
        </motion.div>

      </div>
    </section>
  );
}
