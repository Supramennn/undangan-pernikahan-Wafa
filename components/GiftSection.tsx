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

function BankCard({
  bank,
  number,
  holder,
  delay,
}: {
  bank: string;
  number: string;
  holder: string;
  delay: number;
}) {
  const [copied, setCopied] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  async function handleCopy() {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <motion.div
      ref={ref}
      className="glass-card w-full max-w-[92vw] sm:max-w-lg p-6 sm:p-8 flex flex-col items-center text-center z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Bank Name */}
      <h4 className="font-sans font-bold text-sm sm:text-base tracking-widest text-[var(--ink)] mb-6 uppercase">
        {bank}
      </h4>

      {/* Number & Copy Group */}
      <div className="flex items-center gap-4 bg-[#FAF5EB] px-5 py-3 rounded-xl border border-[#F0E6D3] mb-6 flex-wrap justify-center">
        <span className="font-sans font-bold text-xl sm:text-2xl tracking-[0.1em] text-[var(--gold)]">
          {number}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-[#F5EAD4] hover:bg-[#EBDBC1] text-[var(--gold)] px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition-colors"
          title="Salin Nomor Rekening"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckIcon />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CopyIcon />
              </motion.span>
            )}
          </AnimatePresence>
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>

      {/* Account Holder */}
      <p className="font-sans text-[var(--ink-muted)] font-light text-sm">
        a.n. {holder}
      </p>
    </motion.div>
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
          Namun jika Anda berkenan memberikan hadiah kasih sayang,
          Anda dapat mengirimkannya melalui rekening berikut.
        </p>
      </motion.div>

      {/* Individual Bank Cards */}
      <div className="flex flex-col gap-6 w-full items-center mt-4">
        {WEDDING.bankAccounts.map((acc, i) => (
          <BankCard
            key={acc.bank}
            bank={acc.bank}
            number={acc.number}
            holder={acc.holder}
            delay={i * 0.12}
          />
        ))}

        {/* Physical Gift Address Card (Example matching reference) */}
        <motion.div
          className="glass-card w-full max-w-[92vw] sm:max-w-lg p-6 sm:p-8 flex flex-col items-center text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.24, duration: 0.6 }}
        >
          <h4 className="font-sans font-bold text-sm sm:text-base tracking-widest text-[var(--ink)] mb-4 uppercase">
            Kirim Hadiah Fisik
          </h4>
          <p className="font-sans text-[var(--ink)] font-medium text-sm mb-2">
            Penerima: {WEDDING.groom.nickname} & {WEDDING.bride.nickname}
          </p>
          <p className="font-sans text-[var(--ink-muted)] font-light text-sm mb-6 leading-relaxed max-w-sm">
            {WEDDING.akad.address} {/* Using Akad address as a fallback for gift address */}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(WEDDING.akad.address);
              alert("Alamat berhasil disalin!");
            }}
            className="flex items-center gap-1.5 bg-[#F5EAD4] hover:bg-[#EBDBC1] text-[var(--gold)] px-4 py-2 rounded-md font-sans text-sm font-semibold transition-colors"
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
