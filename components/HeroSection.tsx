"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING } from "@/lib/config";

type Stage = "preloading" | "closed" | "opening" | "open";

/* ── Romantic Floating Hearts ── */
function RomanticHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random hearts for the background
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // 0 to 100%
      size: Math.random() * 12 + 10, // 10px to 22px
      duration: Math.random() * 5 + 7, // 7s to 12s
      delay: Math.random() * 5, // 0s to 5s delay
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <motion.svg
          key={heart.id}
          viewBox="0 0 24 24"
          fill="var(--blush)"
          opacity="0.25"
          className="absolute bottom-[-10%]"
          style={{ width: heart.size, height: heart.size, left: `${heart.left}%` }}
          initial={{ y: 0, opacity: 0, rotate: -20, scale: 0.5 }}
          animate={{
            y: ["0vh", "-110vh"],
            opacity: [0, 0.4, 0.8, 0],
            rotate: [-20, 20, -10, 15],
            x: ["0px", "30px", "-20px", "10px"],
            scale: [0.5, 1, 1, 0.8],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
      ))}
      {/* Soft glows to compliment the hearts */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 400, height: 400, top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(201,144,143,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 350, height: 350, bottom: "-5%", right: "-10%", background: "radial-gradient(circle, rgba(184,151,106,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

/* ── Floating particle component (for cover) ── */
function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "20%",
        background: "radial-gradient(circle, rgba(212,184,150,0.6), transparent)",
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        y: [-20, -120, -200],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ──── Main component ──── */
export default function HeroSection() {
  const [stage, setStage] = useState<Stage>("preloading");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    // Elegant preloader before showing the cover
    const timer = setTimeout(() => {
      setStage("closed");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [stage]);

  // Read guest name from URL: ?to=Nama+Tamu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(decodeURIComponent(to));
  }, []);

  function handleOpen() {
    if (stage !== "closed") return;
    setStage("opening");
    // Dispatch custom event for MusicPlayer to auto-play
    window.dispatchEvent(new CustomEvent("invitation-opened"));
    setTimeout(() => setStage("open"), 1200);
  }

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: "var(--ivory)" }}
    >
      {/* Faded Background Image for Open State */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]">
        <Image
          src={WEDDING.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center md:object-[center_35%]"
          priority
        />
      </div>

      <RomanticHearts />

      {/* Soft vignette (Main content) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, transparent 40%, rgba(44,36,32,0.07) 100%)",
        }}
      />

      <AnimatePresence mode="wait">
        {stage === "preloading" ? (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
            style={{ backgroundColor: "var(--ivory)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-10 h-10 rounded-full"
              style={{ border: "1px solid rgba(184,151,106,0.3)", borderTopColor: "var(--gold)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="script text-xl"
              style={{ color: "var(--ink-muted)", letterSpacing: "0.1em" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {WEDDING.groom.nickname[0]} &amp; {WEDDING.bride.nickname[0]}
            </motion.p>
          </motion.div>
        ) : stage !== "open" ? (
          /* ── COVER STATE ── */
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: "var(--ivory-deep)" }}
            initial={{ y: 0 }}
            animate={{ y: stage === "opening" ? "-100%" : 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Cover Photo — using Next.js Image for proper sizing */}
            <div className="absolute inset-0">
              <Image
                src={WEDDING.heroImage}
                alt="Foto sampul pernikahan"
                fill
                sizes="100vw"
                className="object-cover object-center md:object-[center_35%]"
                priority
              />
            </div>

            {/* Multi-layer gradient overlay for depth and center text legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)
                `,
              }}
            />

            {/* Floating particles on cover */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[15, 30, 50, 65, 80, 90].map((x, i) => (
                <FloatingParticle key={i} delay={i * 1.2} x={x} size={3 + (i % 3)} />
              ))}
            </div>
            
            {/* Content on top of gradient */}
            <div className="relative z-10 flex flex-col items-center text-center text-white w-full max-w-lg">
              {/* Decorative ornament */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden="true">
                  <path
                    d="M24 0C24 0 20 8 12 12C4 16 0 12 0 12C0 12 8 20 16 20C20 20 24 16 24 16C24 16 28 20 32 20C40 20 48 12 48 12C48 12 44 16 36 12C28 8 24 0 24 0Z"
                    fill="rgba(212,184,150,0.4)"
                  />
                </svg>
              </motion.div>

              <motion.h2
                style={{ fontFamily: "var(--font-sans)" }}
                className="text-xs sm:text-sm tracking-[0.35em] uppercase opacity-80 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                The Wedding of
              </motion.h2>
              
              <motion.h1
                className="script text-5xl sm:text-6xl md:text-7xl text-white mb-2"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)", lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {WEDDING.groom.nickname}
              </motion.h1>

              <motion.span
                className="script text-2xl sm:text-3xl mb-2"
                style={{ color: "var(--gold-light)", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                &amp;
              </motion.span>

              <motion.h1
                className="script text-5xl sm:text-6xl md:text-7xl text-white mb-10 pb-2 sm:pb-4"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)", lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {WEDDING.bride.nickname}
              </motion.h1>

              {/* Thin decorative line */}
              <motion.div
                style={{
                  width: 60,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(212,184,150,0.6), transparent)",
                  marginBottom: 24,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              />
              
              <motion.p
                style={{ fontFamily: "var(--font-sans)" }}
                className="text-xs sm:text-sm opacity-75 leading-relaxed mb-6 max-w-[280px] sm:max-w-sm tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                transition={{ delay: 1.1, duration: 0.7 }}
              >
                Dengan penuh kegembiraan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari istimewa pernikahan kami
              </motion.p>
              
              <motion.div
                className="flex flex-col items-center gap-1 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.7 }}
              >
                <span style={{ fontFamily: "var(--font-sans)" }} className="text-xs sm:text-sm tracking-widest uppercase opacity-60">Yth</span>
                {guestName ? (
                   <span style={{ fontFamily: "var(--font-serif)" }} className="text-xl sm:text-2xl font-medium mt-1">{guestName}</span>
                ) : (
                   <span style={{ fontFamily: "var(--font-serif)" }} className="text-lg sm:text-xl font-medium mt-1">Bapak / Ibu / Saudara/i</span>
                )}
              </motion.div>

              <motion.button
                onClick={handleOpen}
                className="btn-primary group flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.2em]"
                style={{
                  minHeight: "auto",
                  width: "auto"
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.7 }}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
                whileTap={{ scale: 0.97 }}
                aria-label="Buka undangan pernikahan"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* ── HERO CONTENT STATE ── */
          <motion.div
            key="content"
            className="relative z-10 flex flex-col items-center text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Small label */}
            <motion.p
              className="label mt-8 mb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              The Wedding Of
            </motion.p>

            {/* Ornament */}
            <motion.div
              className="hr-vertical mb-6"
              style={{ height: 48, transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            />

            {/* Names */}
            <motion.h1
              className="display"
              style={{
                fontSize: "clamp(2.8rem, 12vw, 6rem)",
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
            >
              {WEDDING.groom.nickname}
            </motion.h1>

            <motion.span
              className="script my-2"
              style={{
                fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
                color: "var(--blush)",
                lineHeight: 1.4,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              &amp;
            </motion.span>

            <motion.h1
              className="display"
              style={{
                fontSize: "clamp(2.8rem, 12vw, 6rem)",
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                paddingBottom: "1.5rem", /* Extra padding for descenders */
                marginBottom: "1rem"
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
            >
              {WEDDING.bride.nickname}
            </motion.h1>

            {/* Thin rule */}
            <motion.div
              className="hr-thin hr-thin--lg mt-4 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            />

            {/* Date */}
            <motion.p
              className="label"
              style={{ color: "var(--ink-muted)", letterSpacing: "0.25em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              Senin · 21 September 2026
            </motion.p>

            {/* Scroll hint */}
            <motion.div
              className="flex flex-col items-center gap-2 mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="18" height="26" viewBox="0 0 18 26" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="16" height="24" rx="8" stroke="var(--gold-light)" strokeWidth="1" opacity="0.6" />
                  <motion.rect
                    x="7.5" y="6" width="3" height="5" rx="1.5"
                    fill="var(--gold-light)"
                    opacity="0.7"
                    animate={{ y: [6, 12, 6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
              <span className="label" style={{ fontSize: "0.55rem", color: "var(--ink-muted)", opacity: 0.6 }}>
                Scroll
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}