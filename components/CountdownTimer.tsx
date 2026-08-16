"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WEDDING, formatDate, formatTime } from "@/lib/config";

const WEDDING_DATE = WEDDING.resepsi.dateTime;

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

/* ── Dot separator ── */
function Separator() {
  return (
    <div className="flex flex-col gap-1.5 items-center self-center pb-4">
      <span className="block w-1 h-1 rounded-full" style={{ background: "var(--gold-light)", opacity: 0.7 }} />
      <span className="block w-1 h-1 rounded-full" style={{ background: "var(--gold-light)", opacity: 0.7 }} />
    </div>
  );
}

/* ── Animated time unit ── */
function TimeUnit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="time-unit flex flex-col items-center justify-center relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative flex items-center justify-center">
        <motion.span
          key={value}
          className="time-unit__value"
          initial={{ opacity: 0.6, scale: 0.8, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          style={{ color: "var(--ink)", fontWeight: 400, fontSize: "clamp(2rem, 6vw, 3rem)" }}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="time-unit__label mt-1" style={{ fontWeight: 500, letterSpacing: "0.1em" }}>{label}</span>
    </motion.div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const weddingLabel = WEDDING_DATE.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Sparkle positions — deterministic to avoid hydration mismatch
  const sparkles = [
    { id: 0, left: "15%", top: "20%", delay: 0,   duration: 2.0 },
    { id: 1, left: "30%", top: "75%", delay: 0.4, duration: 1.5 },
    { id: 2, left: "45%", top: "35%", delay: 1.2, duration: 2.5 },
    { id: 3, left: "60%", top: "85%", delay: 0.8, duration: 1.8 },
    { id: 4, left: "75%", top: "45%", delay: 1.6, duration: 2.2 },
    { id: 5, left: "25%", top: "55%", delay: 0.3, duration: 1.3 },
    { id: 6, left: "85%", top: "25%", delay: 1.0, duration: 2.8 },
    { id: 7, left: "50%", top: "65%", delay: 0.6, duration: 1.6 },
    { id: 8, left: "70%", top: "15%", delay: 1.4, duration: 2.3 },
    { id: 9, left: "40%", top: "50%", delay: 0.9, duration: 1.9 },
  ];

  return (
    <section
      ref={ref}
      className="section-wrap relative overflow-hidden"
      style={{ background: "var(--ivory-warm)" }}
    >
      {/* Decorative circle blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            top: "-15%", right: "-10%",
            background: "radial-gradient(circle, rgba(201,144,143,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 320, height: 320,
            bottom: "-10%", left: "-8%",
            background: "radial-gradient(circle, rgba(184,151,106,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Pulse glow behind countdown */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-0 pointer-events-none"
        style={{
          width: 300, height: 300,
          background: "radial-gradient(circle, var(--gold-pale) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Section header */}
      <motion.div
        className="section-header relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Save the Date</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", color: "var(--ink)" }}>
          {weddingLabel}
        </h2>
        <p
          className="label mt-2"
          style={{ color: "var(--ink-muted)", letterSpacing: "0.18em" }}
        >
          Pukul 11.00 WIB
        </p>
      </motion.div>

      {/* Cards Wrapper */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 w-full mt-6">
        {/* Sparkles around countdown */}
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute w-1 h-1 rounded-full bg-white z-20 pointer-events-none"
            style={{ left: s.left, top: s.top, boxShadow: "0 0 4px 1px var(--gold-light)" }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
          />
        ))}

        {/* Countdown card */}
        <motion.div
          className="glass-card relative px-6 py-8 sm:px-14 sm:py-12 w-full max-w-[92vw] sm:max-w-xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Shimmer animation */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              transform: "skewX(-20deg)",
              width: "50%",
            }}
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
          />

          <div className="relative z-10 flex justify-center">
            {time ? (
              <div className="flex items-end justify-center gap-4 sm:gap-8">
                <TimeUnit value={time.days}    label="Hari"   delay={0.3} />
                <Separator />
                <TimeUnit value={time.hours}   label="Jam"    delay={0.4} />
                <Separator />
                <TimeUnit value={time.minutes} label="Menit"  delay={0.5} />
                <Separator />
                <TimeUnit value={time.seconds} label="Detik"  delay={0.6} />
              </div>
            ) : (
              <div className="flex items-end justify-center gap-4 sm:gap-8">
                {["Hari","Jam","Menit","Detik"].map((l) => (
                  <div key={l} className="time-unit flex flex-col items-center opacity-30">
                    <div className="flex items-center justify-center">
                      <span className="time-unit__value" style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>--</span>
                    </div>
                    <span className="time-unit__label mt-1">{l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Venue card */}
        <motion.div
          className="glass-card relative px-8 py-8 sm:px-14 sm:py-10 w-full max-w-[92vw] sm:max-w-md text-center flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            border: "1px solid rgba(184,151,106,0.3)",
          }}
        >
          {/* Reduced clutter: removed heavy corner borders */}

          <span className="label">Lokasi Acara</span>

          <div>
            <p
              className="display text-xl sm:text-2xl"
              style={{ color: "var(--ink)" }}
            >
              Gedung Serbaguna
            </p>
            <p
              className="mt-2 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300 }}
            >
              Jl. Contoh Alamat No. 123<br />Kota, Provinsi
            </p>
          </div>

          <div className="hr-thin" />

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline group overflow-hidden relative"
          >
            <motion.div 
              className="absolute inset-0 bg-[var(--gold-pale)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
            />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="relative z-10 group-hover:-translate-y-0.5 transition-transform">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span className="relative z-10">Petunjuk Arah</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}