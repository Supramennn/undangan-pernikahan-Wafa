"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type GuestEntry = {
  id: string;
  name: string;
  attendance: "hadir" | "tidak_hadir";
  message: string | null;
  created_at: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Baru saja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}h lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function InitialAvatar({ name }: { name: string }) {
  return (
    <div
      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
      style={{
        background: "linear-gradient(135deg, var(--blush-pale), var(--gold-pale))",
        color: "var(--blush)",
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        border: "1px solid rgba(201,144,143,0.3)",
        boxShadow: "0 4px 10px rgba(201,144,143,0.2), inset 0 2px 4px rgba(255,255,255,0.5)",
      }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Guestbook() {
  const [entries, setEntries]   = useState<GuestEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    supabase
      .from("rsvp")
      .select("id, name, attendance, message, created_at")
      .not("message", "is", null)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error) setEntries(data as GuestEntry[]);
        setLoading(false);
      });

    const channel = supabase
      .channel("rsvp-guestbook")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rsvp" }, (payload) => {
        const e = payload.new as GuestEntry;
        if (e.message) setEntries((prev) => [e, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section
      ref={ref}
      className="section-wrap"
      style={{ background: "var(--ivory)" }}
    >
      {/* Header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Ucapan &amp; Doa</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ color: "var(--ink)" }}>Buku Tamu</h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 340 }}
        >
          Doa dan ucapan dari orang-orang yang kami cintai
        </p>
      </motion.div>

      <motion.div
        className="glass-card relative z-10 w-full max-w-[480px]
          p-7 sm:p-9 md:p-10
          max-h-[480px] sm:max-h-[520px] overflow-y-auto scroll-elegant"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <motion.div
              className="w-7 h-7 rounded-full"
              style={{ border: "1.5px solid var(--blush-pale)", borderTopColor: "var(--blush)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <p className="label" style={{ color: "var(--ink-muted)" }}>Memuat…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="42" height="42" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path d="M18 8C18 8 14.5 3 10 6C5.5 9 7 14 10 18L18 27L26 18C29 14 30.5 9 26 6C21.5 3 18 8 18 8Z"
                  stroke="var(--blush)" strokeWidth="1.5" fill="rgba(201,144,143,0.15)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <p className="label mt-2" style={{ color: "var(--ink-muted)" }}>Belum ada ucapan</p>
            <p className="text-xs" style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, opacity: 0.7 }}>
              Jadilah yang pertama mengirim doa!
            </p>
          </div>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {entries.map((entry, i) => (
                <motion.li
                  key={entry.id}
                  className="guest-entry relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i < 5 ? i * 0.08 : 0 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    {/* Left: avatar + name + time */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <InitialAvatar name={entry.name} />
                      <div className="min-w-0">
                        <p
                          className="script text-sm truncate"
                          style={{ color: "var(--ink)" }}
                        >
                          {entry.name}
                        </p>
                        <p
                          className="text-[0.6rem] mt-0.5"
                          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", opacity: 0.6 }}
                        >
                          {timeAgo(entry.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <span
                      className="shrink-0 text-[0.6rem] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: entry.attendance === "hadir"
                          ? "rgba(201,144,143,0.12)"
                          : "rgba(44,36,32,0.07)",
                        color: entry.attendance === "hadir"
                          ? "var(--blush)"
                          : "var(--ink-muted)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {entry.attendance === "hadir" ? "Hadir" : "Tidak"}
                    </span>
                  </div>

                  {/* Message */}
                  {entry.message && (
                    <div className="relative pl-[42px] mt-1">
                      <span className="absolute left-[14px] top-[-6px] text-[2.5rem] font-serif text-[var(--gold)] opacity-30 leading-none" aria-hidden="true">
                        &ldquo;
                      </span>
                      <p
                        className="text-sm leading-relaxed relative z-10"
                        style={{ fontFamily: "var(--font-sans)", color: "var(--ink-soft)", fontWeight: 300 }}
                      >
                        {entry.message}
                      </p>
                    </div>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      {/* Footer note */}
      <motion.p
        className="label mt-8"
        style={{ color: "var(--ink-muted)", opacity: 0.5, fontSize: "0.6rem" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.5 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Pesan diperbarui secara langsung
      </motion.p>
    </section>
  );
}