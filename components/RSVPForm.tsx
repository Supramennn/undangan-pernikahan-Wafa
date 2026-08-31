"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatGuestName } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

/** Label kecil di atas field */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-xs font-semibold tracking-wider uppercase mb-2"
      style={{ color: "var(--ink-soft)" }}>
      {children}
    </label>
  );
}

interface RSVPFormProps {
  guestName?: string;
}

export default function RSVPForm({ guestName: propGuestName }: RSVPFormProps) {
  const initialName = propGuestName && propGuestName !== "Tamu Undangan" ? propGuestName : "";
  const [name, setName]               = useState(initialName);
  const [isAutoFilled, setIsAutoFilled] = useState(Boolean(initialName));
  const [isEditingName, setIsEditingName] = useState(false);
  const [attend, setAttend]           = useState<"hadir" | "tidak_hadir" | "">("");
  const [count, setCount]             = useState(1);
  const [message, setMessage]         = useState("");
  const [status, setStatus]           = useState<Status>("idle");

  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Client-side fallback check for ?to= query param
  useEffect(() => {
    if (!name) {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to");
      if (to) {
        const formatted = formatGuestName(to);
        if (formatted && formatted !== "Tamu Undangan") {
          setName(formatted);
          setIsAutoFilled(true);
        }
      }
    }
  }, [name]);

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
        <p className="mt-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 320 }}>
          Kehadiran Anda adalah hadiah terbaik bagi kami
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        className="glass-card relative z-10 w-full max-w-[480px] p-6 sm:p-8 md:p-10"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
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
              {[...Array(8)].map((_, i) => {
                const randomX = [30, -50, 40, -20, 60, -40, 10, -60][i];
                const randomY = [80, 50, 90, 60, 70, 40, 95, 55][i];
                const delayVal = [1.5, 1.2, 1.8, 1.4, 1.6, 1.3, 1.9, 1.7][i];
                return (
                  <motion.div key={i} className="absolute rounded-full"
                    style={{ width: i % 2 === 0 ? 6 : 4, height: i % 2 === 0 ? 6 : 4,
                      background: i % 3 === 0 ? "var(--blush)" : "var(--gold)", top: "40%", left: "50%" }}
                    initial={{ x: "-50%", y: "-50%", opacity: 1 }}
                    animate={{ x: `calc(-50% + ${randomX}px)`, y: `calc(-50% - ${randomY}px)`, opacity: 0 }}
                    transition={{ duration: delayVal, ease: "easeOut" }}
                  />
                );
              })}
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                  <circle cx="20" cy="26" r="11" stroke="var(--blush)" strokeWidth="1.2" opacity="0.6" />
                  <circle cx="32" cy="26" r="11" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6" />
                </svg>
              </motion.div>
              <p className="display text-2xl sm:text-3xl mt-4" style={{ color: "var(--ink)" }}>Terima kasih!</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 280 }}>
                Konfirmasi kehadiran Anda sudah kami terima dengan penuh sukacita.
              </p>
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
              {/* Nama Lengkap */}
              <div>
                {isAutoFilled && !isEditingName ? (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <FieldLabel>Nama Lengkap</FieldLabel>
                      <span className="text-[11px] text-[var(--gold)] font-medium flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Terisi Otomatis
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/95 border border-[var(--gold)]/35 shadow-2xs min-h-[48px]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[var(--gold-pale)]/70 border border-[var(--gold)]/30 flex items-center justify-center text-xs font-serif italic text-[var(--gold)] shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-sans text-sm font-semibold text-[var(--ink)] truncate">
                          {name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="text-xs text-[var(--ink-muted)] hover:text-[var(--gold)] underline shrink-0 cursor-pointer ml-2"
                        title="Ubah nama jika perlu"
                      >
                        Ubah
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Nama Lengkap</FieldLabel>
                      {isAutoFilled && isEditingName && (
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="text-[11px] text-[var(--ink-muted)] hover:text-[var(--gold)] underline cursor-pointer mb-2"
                        >
                          Batal Ubah
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tulis nama Anda..."
                      autoComplete="name"
                      className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-white/90 border border-[var(--gold)]/30 text-[var(--ink)] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 focus:border-[var(--gold)] focus:bg-white transition-all min-h-[48px]"
                    />
                  </div>
                )}
              </div>

              {/* Kehadiran */}
              <div>
                <FieldLabel>Konfirmasi Kehadiran</FieldLabel>
                <div 
                  className="grid grid-cols-2 p-1.5 rounded-xl gap-2 border bg-neutral-100/70 border-[var(--gold)]/20"
                >
                  <button
                    type="button"
                    onClick={() => setAttend("hadir")}
                    className="py-3 px-3 rounded-lg font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={attend === "hadir"
                      ? { background: "var(--gold)", color: "white", boxShadow: "0 2px 10px rgba(156, 119, 84, 0.3)" }
                      : { color: "var(--ink-muted)", background: "transparent" }
                    }
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttend("tidak_hadir")}
                    className="py-3 px-3 rounded-lg font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={attend === "tidak_hadir"
                      ? { background: "var(--gold)", color: "white", boxShadow: "0 2px 10px rgba(156, 119, 84, 0.3)" }
                      : { color: "var(--ink-muted)", background: "transparent" }
                    }
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              {/* Jumlah tamu — muncul jika hadir */}
              <AnimatePresence>
                {attend === "hadir" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: -6 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: -6 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <FieldLabel>Jumlah Tamu</FieldLabel>
                    <div className="relative">
                      <select
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-white/90 border border-[var(--gold)]/30 text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 focus:border-[var(--gold)] focus:bg-white transition-all appearance-none cursor-pointer min-h-[48px]"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} Orang</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--gold)]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ucapan & Doa */}
              <div>
                <FieldLabel>
                  Ucapan &amp; Doa{" "}
                  <span className="font-normal normal-case tracking-normal" style={{ color: "var(--ink-muted)", opacity: 0.65 }}>
                    (opsional)
                  </span>
                </FieldLabel>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-white/90 border border-[var(--gold)]/30 text-[var(--ink)] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 focus:border-[var(--gold)] focus:bg-white transition-all resize-none min-h-[100px]"
                />
              </div>

              {/* Error Notification */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    className="text-xs px-4 py-3 rounded-xl font-sans text-center font-medium"
                    style={{ background: "rgba(239, 68, 68, 0.08)", color: "#B91C1C", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {!name.trim() || !attend
                      ? "Mohon isi nama dan pilih konfirmasi kehadiran Anda."
                      : "Gagal mengirim konfirmasi. Silakan coba lagi nanti."}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary mt-2 relative overflow-hidden group w-full cursor-pointer"
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
                  <span className="relative z-10 flex items-center justify-center gap-2 font-semibold tracking-[0.16em]">
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