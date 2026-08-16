"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error";

export default function RSVPForm() {
  const [name, setName]           = useState("");
  const [attend, setAttend]       = useState<"hadir" | "tidak_hadir" | "">("");
  const [count, setCount]         = useState(1);
  const [message, setMessage]     = useState("");
  const [status, setStatus]       = useState<Status>("idle");

  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !attend) { setStatus("error"); return; }

    setStatus("loading");
    const { error } = await supabase.from("rsvp").insert({
      name:        name.trim(),
      attendance:  attend,
      guest_count: attend === "hadir" ? count : 0,
      message:     message.trim() || null,
    });

    if (error) { console.error(error.message); setStatus("error"); return; }

    setStatus("success");
    setName(""); setAttend(""); setCount(1); setMessage("");
  }

  return (
    <section
      id="rsvp"
      ref={ref}
      className="section-wrap"
      style={{ background: "var(--ivory-warm)" }}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 360, height: 360, top: "-5%", right: "-8%", background: "radial-gradient(circle, rgba(201,144,143,0.09) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 280, bottom: "-5%", left: "-5%", background: "radial-gradient(circle, rgba(184,151,106,0.07) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Konfirmasi Kehadiran</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ color: "var(--ink)" }}>RSVP</h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 320 }}
        >
          Kehadiran Anda adalah hadiah terbaik bagi kami
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        className="glass-card relative z-10 w-full max-w-[92vw] sm:max-w-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* Decorative Ornament */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center w-full pointer-events-none">
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none" aria-hidden="true" style={{ color: "var(--gold)" }}>
            <path d="M30 10c-5-5-10-8-20-8v2c8 0 12 3 18 8-6 5-10 8-18 8v2c10 0 15-3 20-8 5 5 10 8 20 8v-2c-8 0-12-3-18-8 6-5 10-8 18-8V2c-10 0-15 3-20 8z" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            /* ── SUCCESS ── */
            <motion.div
              key="success"
              className="text-center py-6 flex flex-col items-center gap-4 relative"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Confetti Particles */}
              {[...Array(8)].map((_, i) => {
                const randomX = [30, -50, 40, -20, 60, -40, 10, -60][i];
                const randomY = [80, 50, 90, 60, 70, 40, 95, 55][i];
                const delayStr = [1.5, 1.2, 1.8, 1.4, 1.6, 1.3, 1.9, 1.7][i];
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: i % 2 === 0 ? 6 : 4,
                      height: i % 2 === 0 ? 6 : 4,
                      background: i % 3 === 0 ? "var(--blush)" : "var(--gold)",
                      top: "40%",
                      left: "50%",
                    }}
                    initial={{ x: "-50%", y: "-50%", opacity: 1 }}
                    animate={{
                      x: `calc(-50% + ${randomX}px)`,
                      y: `calc(-50% - ${randomY}px)`,
                      opacity: 0,
                    }}
                    transition={{ duration: delayStr, ease: "easeOut" }}
                  />
                );
              })}

              {/* Animated rings */}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                  <circle cx="20" cy="26" r="11" stroke="var(--blush)" strokeWidth="1.2" opacity="0.6" />
                  <circle cx="32" cy="26" r="11" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6" />
                </svg>
              </motion.div>
              <p className="display text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>Terima kasih!</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 260 }}>
                Konfirmasi kehadiran Anda sudah kami terima dengan penuh sukacita.
              </p>
              <div className="hr-thin hr-thin--lg mt-2" />
            </motion.div>
          ) : (
            /* ── FORM ── */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Name */}
              <div>
                <label className="field-label" htmlFor="rsvp-name">Nama Lengkap</label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tulis nama Anda"
                  className="field-input transition-all duration-300 focus:ring-2 focus:ring-[var(--blush-pale)] focus:border-[var(--blush)] outline-none"
                  autoComplete="name"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="field-label">Kehadiran</label>
                <div className="flex gap-1.5 p-1 rounded-lg" style={{ background: "rgba(0,0,0,0.04)" }}>
                  {[
                    { value: "hadir",       label: "✦ Hadir" },
                    { value: "tidak_hadir", label: "Tidak Hadir" },
                  ].map((opt) => (
                    <div key={opt.value} className="relative flex-1">
                      {attend === opt.value && (
                        <motion.div
                          layoutId="attend-bg"
                          className="absolute inset-0 rounded-md shadow-sm"
                          style={{ background: "white" }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setAttend(opt.value as "hadir" | "tidak_hadir")}
                        className={`relative z-10 w-full py-2.5 text-sm font-medium transition-colors duration-300 ${
                          attend === opt.value ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink-soft)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest count */}
              <AnimatePresence>
                {attend === "hadir" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className="field-label" htmlFor="rsvp-count">Jumlah Tamu</label>
                    <input
                      id="rsvp-count"
                      type="number"
                      min={1}
                      max={5}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="field-input transition-all duration-300 focus:ring-2 focus:ring-[var(--blush-pale)] focus:border-[var(--blush)] outline-none"
                      inputMode="numeric"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div>
                <label className="field-label" htmlFor="rsvp-message">
                  Ucapan &amp; Doa
                  <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: "normal", opacity: 0.55, marginLeft: 4 }}>
                    (opsional)
                  </span>
                </label>
                <textarea
                  id="rsvp-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis ucapan untuk kedua mempelai…"
                  rows={2}
                  className="field-input resize-none transition-all duration-300 focus:ring-2 focus:ring-[var(--blush-pale)] focus:border-[var(--blush)] outline-none"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: "rgba(200,60,60,0.07)", border: "1px solid rgba(200,60,60,0.15)", color: "rgba(180,40,40,0.8)", fontFamily: "var(--font-sans)" }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {!name.trim() || !attend
                      ? "Mohon isi nama dan konfirmasi kehadiran."
                      : "Gagal mengirim. Silakan coba lagi."}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary mt-1 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                
                {status === "loading" ? (
                  <>
                    <motion.span
                      className="block w-4 h-4 rounded-full border border-white/30 border-t-white relative z-10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Mengirim…</span>
                  </>
                ) : (
                  <>
                    <svg className="relative z-10" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    <span className="relative z-10">Kirim Konfirmasi</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}