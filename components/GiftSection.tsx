"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { WEDDING } from "@/lib/config";

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      className="glass-card relative w-full px-6 py-6 sm:px-8 sm:py-7"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Bank info */}
        <div>
          <p
            className="label"
            style={{ color: "var(--gold)", letterSpacing: "0.18em", marginBottom: 6 }}
          >
            {bank}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
              color: "var(--ink)",
              letterSpacing: "0.12em",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            {number}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 300,
              color: "var(--ink-muted)",
              marginTop: 4,
            }}
          >
            a/n {holder}
          </p>
        </div>

        {/* Copy button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-2 btn-outline hover:bg-[var(--blush-pale)] transition-colors duration-300"
          style={{ padding: "10px 18px", fontSize: "0.75rem", fontWeight: 500 }}
          aria-label={`Salin nomor rekening ${bank}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                className="flex items-center gap-2"
                style={{ color: "var(--blush)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CheckIcon />
                Tersalin!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CopyIcon />
                Salin
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Shimmer Sweep Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        initial={{ x: "-150%", skewX: -20 }}
        animate={{ x: "200%" }}
        transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 3 + delay * 2, ease: "easeInOut" }}
      />
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
      {/* Decorative blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 380, height: 380, top: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(184,151,106,0.07) 0%, transparent 70%)" }} />
      </div>

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

      {/* Gift icon */}
      <motion.div
        className="mb-10 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative"
            style={{
              background: "linear-gradient(135deg, var(--blush-pale), var(--gold-pale))",
              border: "1px solid rgba(184,151,106,0.2)",
            }}
          >
            {/* Gentle pulsing glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--blush)", opacity: 0.2 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            🎁
          </div>
        </motion.div>

        {/* Orbiting decorations */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 text-[var(--gold)]">✦</div>
          <div className="absolute bottom-1 right-2 w-3 h-3 text-[var(--blush)]" style={{ fontSize: "10px" }}>❤</div>
          <div className="absolute top-4 right-[-8px] w-3 h-3 text-[var(--gold)] text-xs">✧</div>
        </motion.div>
      </motion.div>

      {/* Bank cards */}
      <div className="relative z-10 flex flex-col gap-4 w-full max-w-[92vw] sm:max-w-lg">
        {WEDDING.bankAccounts.map((acc, i) => (
          <BankCard
            key={acc.bank}
            bank={acc.bank}
            number={acc.number}
            holder={acc.holder}
            delay={i * 0.12}
          />
        ))}
      </div>
    </section>
  );
}
