"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WEDDING, formatDate, formatTime, googleCalendarUrl } from "@/lib/config";

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

interface EventCardProps {
  type: "Akad Nikah" | "Resepsi";
  icon: string;
  dateTime: Date;
  endTime: Date;
  venue: string;
  address: string;
  mapsUrl: string;
  delay: number;
}

function EventCard({ type, icon, dateTime, endTime, venue, address, mapsUrl, delay }: EventCardProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const gcalUrl = googleCalendarUrl({
    title:    `${type} — ${WEDDING.groom.nickname} & ${WEDDING.bride.nickname}`,
    start:    dateTime,
    end:      endTime,
    location: `${venue}, ${address}`,
    details:  `Kami dengan penuh sukacita mengundang Anda ke ${type} Pernikahan ${WEDDING.groom.nickname} & ${WEDDING.bride.nickname}`,
  });

  return (
    <motion.div
      ref={ref}
      className="glass-card relative w-full max-w-[92vw] sm:max-w-sm sm:flex-1 px-7 py-8 sm:px-10 sm:py-10 flex flex-col gap-5 text-center items-center justify-between z-10"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      transition={{ 
        opacity: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        y: { type: "spring", stiffness: 300, damping: 20 },
        boxShadow: { duration: 0.2 }
      }}
    >
      {/* Reduced clutter: removed corner borders */}

      {/* Icon badge */}
      <motion.div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl relative"
        style={{
          background: "linear-gradient(135deg, var(--blush-pale), var(--gold-pale))",
          border: "1px solid rgba(184,151,106,0.2)",
        }}
        animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(184,151,106,0)", "0 0 15px rgba(184,151,106,0.3)", "0 0 0px rgba(184,151,106,0)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <span className="relative z-10">{icon}</span>
      </motion.div>

      <div className="flex flex-col gap-5 items-center w-full flex-1">

      {/* Type */}
      <div>
        <p className="label" style={{ color: "var(--gold)", letterSpacing: "0.18em" }}>
          {type}
        </p>
        <p
          className="display mt-1"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)", color: "var(--ink)" }}
        >
          {formatDate(dateTime, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="hr-thin w-full" style={{ opacity: 0.5 }} />

      {/* Details */}
      <ul className="flex flex-col gap-3 text-left w-full">
        <li className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0" style={{ color: "var(--blush)" }}><ClockIcon /></span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 300, color: "var(--ink-soft)" }}>
            {formatTime(dateTime)} – {formatTime(endTime)}
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0" style={{ color: "var(--blush)" }}><MapPinIcon /></span>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 400, color: "var(--ink-soft)" }}>
              {venue}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 300, color: "var(--ink-muted)" }}>
              {address}
            </p>
          </div>
        </li>
      </ul>
      </div>

      <div className="hr-thin w-full" style={{ opacity: 0.5 }} />

      {/* Buttons */}
      <div className="flex gap-2.5 w-full shrink-0">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 text-center group relative overflow-hidden"
          style={{ padding: "10px 12px", fontSize: "0.7rem", borderColor: "var(--gold-pale)" }}
        >
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(235,214,213,0.3), rgba(246,238,223,0.3))" }} />
          <span className="relative z-10 flex items-center justify-center gap-1.5"><MapPinIcon /> Peta</span>
        </a>
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 text-center group relative overflow-hidden"
          style={{ padding: "10px 12px", fontSize: "0.7rem", borderColor: "var(--gold-pale)" }}
        >
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(235,214,213,0.3), rgba(246,238,223,0.3))" }} />
          <span className="relative z-10 flex items-center justify-center gap-1.5"><CalendarIcon /> Kalender</span>
        </a>
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
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--ink-muted)",
            fontWeight: 300,
            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
            maxWidth: 380,
          }}
        >
          Kami mengundang Anda untuk hadir dan menjadi bagian dari momen suci ini
        </p>
      </motion.div>

      {/* Event cards with timeline connector */}
      <div className="relative z-0 flex flex-col sm:flex-row gap-6 sm:gap-10 items-stretch w-full max-w-4xl justify-center mt-4">
        {/* Connector Line */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-full sm:w-full sm:h-0.5 pointer-events-none z-0" style={{ background: "linear-gradient(to bottom, transparent, var(--gold-pale), transparent)" }}>
           {/* Desktop horizontal override */}
           <style jsx>{`
             @media (min-width: 640px) {
               div { background: linear-gradient(to right, transparent, var(--gold-pale), transparent) !important; }
             }
           `}</style>
           {/* Animated dot moving along timeline */}
           <motion.div 
             className="absolute w-2 h-2 rounded-full hidden sm:block"
             style={{ background: "var(--blush)", top: "-3px", left: "0%" }}
             animate={{ left: ["0%", "100%", "0%"] }}
             transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
           />
           <motion.div 
             className="absolute w-2 h-2 rounded-full sm:hidden block"
             style={{ background: "var(--blush)", left: "-3px", top: "0%" }}
             animate={{ top: ["0%", "100%", "0%"] }}
             transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
           />
        </div>

        <EventCard
          type="Akad Nikah"
          icon="🕌"
          dateTime={WEDDING.akad.dateTime}
          endTime={WEDDING.akad.endTime}
          venue={WEDDING.akad.venue}
          address={WEDDING.akad.address}
          mapsUrl={WEDDING.akad.mapsUrl}
          delay={0.1}
        />
        <EventCard
          type="Resepsi"
          icon="🌸"
          dateTime={WEDDING.resepsi.dateTime}
          endTime={WEDDING.resepsi.endTime}
          venue={WEDDING.resepsi.venue}
          address={WEDDING.resepsi.address}
          mapsUrl={WEDDING.resepsi.mapsUrl}
          delay={0.25}
        />
      </div>
    </section>
  );
}
