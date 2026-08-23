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
        className="glass-card relative z-10 w-full max-w-[92vw] sm:max-w-lg p-6 sm:p-10"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            /* ── SUCCESS ── */
            <motion.div
              key="success"
              className="text-center py-8 flex flex-col items-center gap-4 relative"
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
              <p className="display text-2xl sm:text-3xl mt-4" style={{ color: "var(--ink)" }}>Terima kasih!</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 260 }}>
                Konfirmasi kehadiran Anda sudah kami terima dengan penuh sukacita.
              </p>
            </motion.div>
          ) : (
            /* ── FORM ── */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold tracking-widest text-[var(--ink)] uppercase" htmlFor="rsvp-name">
                  Nama Lengkap
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tulis nama Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white font-sans text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  autoComplete="name"
                />
              </div>

              {/* Attendance */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold tracking-widest text-[var(--ink)] uppercase">
                  Kehadiran
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAttend("hadir")}
                    className={`flex-1 py-3 rounded-xl font-sans text-sm font-medium transition-all ${
                      attend === "hadir" 
                        ? "bg-[var(--gold)] text-white shadow-md" 
                        : "bg-[#FAF5EB] text-[var(--ink-muted)] hover:bg-[#F0E6D3]"
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttend("tidak_hadir")}
                    className={`flex-1 py-3 rounded-xl font-sans text-sm font-medium transition-all ${
                      attend === "tidak_hadir" 
                        ? "bg-[#6B2D31] text-white shadow-md" 
                        : "bg-[#FAF5EB] text-[var(--ink-muted)] hover:bg-[#F0E6D3]"
                    }`}
                  >
                    Tidak Hadir
                  </button>
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
                    className="flex flex-col gap-2"
                  >
                    <label className="font-sans text-xs font-bold tracking-widest text-[var(--ink)] uppercase" htmlFor="rsvp-count">
                      Jumlah Tamu
                    </label>
                    <select
                      id="rsvp-count"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white font-sans text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                      <option value={5}>5 Orang</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold tracking-widest text-[var(--ink)] uppercase flex items-center justify-between" htmlFor="rsvp-message">
                  <span>Ucapan & Doa</span>
                  <span className="text-gray-400 font-normal lowercase tracking-normal text-[10px]">opsional</span>
                </label>
                <textarea
                  id="rsvp-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis ucapan selamat..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white font-sans text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    className="text-xs px-4 py-3 rounded-xl bg-red-50 text-red-600 font-sans border border-red-100 text-center"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {!name.trim() || !attend
                      ? "Mohon isi nama dan konfirmasi kehadiran Anda."
                      : "Gagal mengirim pesan. Silakan coba lagi nanti."}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary mt-2 relative overflow-hidden group w-full"
              >
                <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                
                {status === "loading" ? (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <motion.span
                      className="block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Mengirim...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2 font-bold tracking-widest">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    KIRIM KONFIRMASI
                  </span>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}