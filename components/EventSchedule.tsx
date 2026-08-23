"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WEDDING, formatDate, formatTime, googleCalendarUrl } from "@/lib/config";

// SVG Icons matching the reference design
function MosqueIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L8 6h8l-4-4z" />
      <rect x="4" y="10" width="16" height="12" />
      <path d="M4 10V6h16v4" />
      <path d="M8 10v12M12 10v12M16 10v12" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v2c0 2.8 2.2 5 5 5h4c2.8 0 5-2.2 5-5V5c0-1.1-.9-2-2-2z" />
      <path d="M12 12v5" />
      <path d="M9 17h6" />
      <path d="M8 21h8" />
      <path d="M8 19v2M16 19v2" />
      <path d="M5 5h14" />
    </svg>
  );
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
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="glass-card relative w-full lg:flex-1 p-6 sm:p-8 flex flex-col gap-5 text-center items-center z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Icon */}
      <div className="mb-2">
        {icon}
      </div>

      {/* Type */}
      <h3 className="display text-3xl sm:text-4xl" style={{ color: "var(--ink)", marginBottom: "4px" }}>
        {type}
      </h3>

      {/* Time */}
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--ink-muted)", fontWeight: 400 }}>
        {formatTime(dateTime)} - {formatTime(endTime)}
      </p>

      {/* Venue */}
      <div className="mt-2 mb-2 flex flex-col gap-1">
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "var(--ink)", fontWeight: 500 }}>
          {venue}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink-muted)", fontWeight: 300, lineHeight: 1.5 }}>
          {address}
        </p>
      </div>

      {/* Button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full mt-2"
      >
        BUKA GOOGLE MAPS
      </a>

      {/* Map Embed */}
      {mapEmbedUrl && (
        <div className="w-full h-[180px] rounded-xl overflow-hidden mt-4 border border-[rgba(0,0,0,0.05)] shadow-inner relative">
          <iframe 
            src={mapEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </div>
      )}
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
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch w-full max-w-5xl justify-center mt-2">
        <EventCard
          type="Akad Nikah"
          icon={<MosqueIcon />}
          dateTime={WEDDING.akad.dateTime}
          endTime={WEDDING.akad.endTime}
          venue={WEDDING.akad.venue}
          address={WEDDING.akad.address}
          mapsUrl={WEDDING.akad.mapsUrl}
          mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273616641577!2d106.79796031536838!3d-6.227608295491823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14eb25b9679%3A0x6b5a3713d288d66!2sMasjid%20Agung%20Al-Azhar!5e0!3m2!1sid!2sid!4v1689260195563!5m2!1sid!2sid"
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
          mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3059424840427!2d106.8071887153681!3d-6.223337995495574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15191b262e3%3A0xd3b8bbce0c910b23!2sThe%20Ritz-Carlton%20Jakarta%2C%20Pacific%20Place!5e0!3m2!1sid!2sid!4v1689260237731!5m2!1sid!2sid"
          delay={0.25}
        />
      </div>
    </section>
  );
}
