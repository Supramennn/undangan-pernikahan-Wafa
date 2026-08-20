"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const photos = [
  { src: "/gallery/photo-1.webp", alt: "Momen bersama 1", span: "tall" },
  { src: "/gallery/photo-2.webp", alt: "Momen bersama 2", span: "normal" },
  { src: "/gallery/photo-3.webp", alt: "Momen bersama 3", span: "normal" },
  { src: "/gallery/photo-4.webp", alt: "Momen bersama 4", span: "normal" },
  { src: "/gallery/photo-5.webp", alt: "Momen bersama 5", span: "normal" },
] as const;

export default function GallerySection() {
  const [active, setActive] = useState<number | null>(null);

  const prev = () => setActive((n) => (n === null ? null : (n - 1 + photos.length) % photos.length));
  const next = () => setActive((n) => (n === null ? null : (n + 1) % photos.length));

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <section
      id="galeri"
      className="section-wrap"
      style={{ background: "var(--ivory)" }}
    >
      {/* Header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
      >
        <span className="label">Our Story</span>
        <div className="hr-thin" style={{ marginBlock: "16px" }} />
        <h2 className="display" style={{ color: "var(--ink)" }}>
          Galeri Kenangan
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-muted)", fontWeight: 300, maxWidth: 360 }}
        >
          Setiap momen adalah cerita yang abadi
        </p>
      </motion.div>

      {/* Photo grid — 5 photos, proportional masonry */}
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setActive(i)}
            className={`photo-card group gallery-item gallery-item--${i + 1}`}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.6, type: "spring", bounce: 0.25 }}
            aria-label={`Lihat foto: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ transition: "transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)" }}
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Grid bottom counter */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <span className="label" style={{ color: "var(--ink-muted)", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
          {photos.length} Momen Terabadikan
        </span>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActive(null)}
          >
            {/* Background with vignette */}
            <div className="absolute inset-0 bg-black/90" style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.98) 100%)" }} />
            {/* Close */}
            <button
              onClick={() => setActive(null)}
              className="lightbox-btn absolute top-5 right-5 z-10"
              aria-label="Tutup"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="lightbox-btn absolute left-4 sm:left-6 z-10"
              aria-label="Foto sebelumnya"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Image */}
            <motion.div
              key={active}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl"
              style={{ aspectRatio: "3/4" }}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={photos[active].src}
                alt={photos[active].alt}
                fill
                sizes="90vw"
                className="object-cover object-top"
                style={{ borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
                priority
              />
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="lightbox-btn absolute right-4 sm:right-6 z-10"
              aria-label="Foto berikutnya"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Counter */}
            <p
              className="absolute bottom-6 left-1/2 -translate-x-1/2 label"
              style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.2em" }}
            >
              {active + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}