"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { WEDDING, formatDate, formatTime } from "@/lib/config";

function MosqueIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L8 6h8l-4-4z" />
      <rect x="4" y="10" width="16" height="12" />
      <path d="M4 10V6h16v4" />
      <path d="M8 10v12M12 10v12M16 10v12" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v2c0 2.8 2.2 5 5 5h4c2.8 0 5-2.2 5-5V5c0-1.1-.9-2-2-2z" />
      <path d="M12 12v5" />
      <path d="M9 17h6" />
      <path d="M8 21h8" />
      <path d="M8 19v2M16 19v2" />
      <path d="M5 5h14" />
    </svg>
  );
}

function extractEmbedUrl(urlOrIframe?: string): string | undefined {
  if (!urlOrIframe) return undefined;
  if (urlOrIframe.startsWith("http://") || urlOrIframe.startsWith("https://")) {
    return urlOrIframe;
  }
  const match = urlOrIframe.match(/src=["']([^"']+)["']/);
  return match ? match[1] : urlOrIframe;
}

interface EventCardProps {
  type: "Akad Nikah" | "Resepsi";
  icon: React.ReactNode;
  dateTime: Date;
  endTime: Date;
  venue: string;
  address: string;
  mapsUrl: string;
  mapEmbedUrl?: string;
  delay: number;
}

function EventCard({ type, icon, dateTime, endTime, venue, address, mapsUrl, mapEmbedUrl, delay }: EventCardProps) {
  const ref         = useRef(null);
  const inView      = useInView(ref, { once: true, margin: "-60px" });
  const [showMap, setShowMap] = useState(false);
  const safeEmbedUrl = extractEmbedUrl(mapEmbedUrl);

  const dateLabel = dateTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      ref={ref}
      className="glass-card relative w-full p-6 sm:p-8 md:p-10 flex flex-col items-center justify-between text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="w-full flex flex-col items-center">
        {/* Icon in gold tinted circle */}
        <div className="w-14 h-14 rounded-full bg-[var(--gold-pale)]/30 border border-[var(--gold)]/25 flex items-center justify-center mb-4 shadow-xs">
          {icon}
        </div>

        {/* Event Title */}
        <h3 className="display text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>
          {type}
        </h3>

        {/* Date badge */}
        <span className="inline-flex items-center gap-1.5 mt-2 px-4 py-1 rounded-full text-xs font-medium tracking-wider bg-[var(--gold-pale)]/50 text-[var(--gold)] border border-[var(--gold)]/25 font-sans">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {dateLabel}
        </span>

        {/* Time */}
        <p className="mt-3 text-xs sm:text-sm font-sans font-medium" style={{ color: "var(--ink-soft)" }}>
          Pukul {formatTime(dateTime)} — {formatTime(endTime)}
        </p>

        {/* Soft Divider */}
        <div className="hr-thin w-16 my-4" style={{ opacity: 0.5 }} />

        {/* Venue & Address */}
        <div className="flex flex-col gap-1.5 w-full">
          <p className="font-sans text-base sm:text-lg font-semibold" style={{ color: "var(--ink)" }}>
            {venue}
          </p>
          <p className="font-sans text-xs sm:text-sm leading-relaxed" style={{ color: "var(--ink-muted)", fontWeight: 300, maxWidth: 320, marginInline: "auto" }}>
            {address}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full mt-6">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Buka Google Maps
        </a>

        {/* Collapsible map toggle */}
        {mapEmbedUrl && (
          <button
            onClick={() => setShowMap((v) => !v)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-sans text-xs font-medium tracking-widest uppercase transition-colors hover:text-[var(--ink)] cursor-pointer"
            style={{ color: "var(--ink-muted)", letterSpacing: "0.14em" }}
          >
            <motion.svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              animate={{ rotate: showMap ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
            {showMap ? "Sembunyikan Peta" : "Lihat Peta Lokasi"}
          </button>
        )}

        {/* Collapsible Map Embed */}
        <AnimatePresence>
          {showMap && safeEmbedUrl && (
            <motion.div
              className="w-full rounded-2xl overflow-hidden border border-[var(--gold)]/25 relative shadow-inner mt-2"
              style={{ height: 210 }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 210 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <iframe
                src={safeEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function EventSchedule() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="jadwal"
      className="section-wrap relative"
      style={{ background: "var(--ivory)" }}
    >
      {/* Header */}
      <motion.div
        ref={ref}
        className="section-header relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Rangkaian Acara</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ color: "var(--ink)" }}>Jadwal Pernikahan</h2>
      </motion.div>

      {/* Event cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl justify-center mt-2 items-stretch">
        <EventCard
          type="Akad Nikah"
          icon={<MosqueIcon />}
          dateTime={WEDDING.akad.dateTime}
          endTime={WEDDING.akad.endTime}
          venue={WEDDING.akad.venue}
          address={WEDDING.akad.address}
          mapsUrl={WEDDING.akad.mapsUrl}
          mapEmbedUrl={WEDDING.akad.mapEmbedUrl}
          delay={0.1}
        />
        <EventCard
          type="Resepsi"
          icon={<CupIcon />}
          dateTime={WEDDING.resepsi.dateTime}
          endTime={WEDDING.resepsi.endTime}
          venue={WEDDING.resepsi.venue}
          address={WEDDING.resepsi.address}
          mapsUrl={WEDDING.resepsi.mapsUrl}
          mapEmbedUrl={WEDDING.resepsi.mapEmbedUrl}
          delay={0.25}
        />
      </div>
    </section>
  );
}
