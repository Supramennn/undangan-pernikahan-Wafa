"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WEDDING } from "@/lib/config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

function PersonCard({
  name,
  fullName,
  parentInfo,
  photo,
}: {
  name: string;
  fullName: string;
  parentInfo: string;
  photo: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center text-center gap-5 relative z-10"
    >
      {/* Photo ring */}
      <div
        className="relative"
        style={{
          width:  "clamp(160px, 36vw, 220px)",
          height: "clamp(160px, 36vw, 220px)",
        }}
      >
        {/* Outer decorative ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{
            background: "linear-gradient(135deg, var(--blush-pale), var(--gold-pale), var(--blush-pale))",
            transform: "scale(1.06)",
          }}
        />
        {/* Photo */}
        <div className="relative w-full h-full rounded-full overflow-hidden" style={{ zIndex: 1 }}>
          <Image
            src={photo}
            alt={`Foto ${name}`}
            fill
            sizes="(max-width: 639px) 40vw, 220px"
            className="object-cover"
            priority
          />
        </div>
        {/* Inner shimmer ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            zIndex: 2,
            boxShadow: "0 0 0 2px rgba(184,151,106,0.3) inset, 0 8px 32px rgba(44,36,32,0.1)",
          }}
        />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <p
          className="display"
          style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", color: "var(--ink)" }}
        >
          {name}
        </p>
        <p className="script" style={{ color: "var(--ink-soft)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
          {fullName}
        </p>
        <p
          className="label"
          style={{ color: "var(--ink-muted)", letterSpacing: "0.12em", lineHeight: 1.6, maxWidth: 260 }}
        >
          {parentInfo}
        </p>
      </div>
    </motion.div>
  );
}

export default function CoupleSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Floating particles — deterministic to avoid hydration mismatch
  const particles = [
    { id: 0, size: 3, left: "8%",  top: "15%", duration: 7, delay: 0 },
    { id: 1, size: 4, left: "22%", top: "65%", duration: 9, delay: 0.5 },
    { id: 2, size: 2, left: "35%", top: "40%", duration: 6, delay: 1.0 },
    { id: 3, size: 5, left: "50%", top: "80%", duration: 8, delay: 0.3 },
    { id: 4, size: 3, left: "65%", top: "25%", duration: 7, delay: 1.5 },
    { id: 5, size: 4, left: "78%", top: "55%", duration: 9, delay: 0.8 },
    { id: 6, size: 2, left: "90%", top: "35%", duration: 6, delay: 1.2 },
    { id: 7, size: 3, left: "15%", top: "90%", duration: 8, delay: 0.6 },
    { id: 8, size: 5, left: "42%", top: "10%", duration: 7, delay: 1.8 },
    { id: 9, size: 2, left: "58%", top: "70%", duration: 9, delay: 0.4 },
    { id: 10, size: 4, left: "72%", top: "48%", duration: 6, delay: 1.3 },
    { id: 11, size: 3, left: "85%", top: "78%", duration: 8, delay: 0.9 },
    { id: 12, size: 5, left: "28%", top: "52%", duration: 7, delay: 1.6 },
    { id: 13, size: 2, left: "95%", top: "18%", duration: 9, delay: 0.2 },
    { id: 14, size: 4, left: "5%",  top: "42%", duration: 6, delay: 1.1 },
  ];

  return (
    <section
      id="mempelai"
      className="section-wrap relative overflow-hidden"
      style={{ background: "var(--ivory-warm)" }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              background: "var(--gold-pale)",
              opacity: 0.6,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Decorative blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full" style={{ width: 440, height: 440, top: "-15%", left: "-10%", background: "radial-gradient(circle, rgba(201,144,143,0.07) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full" style={{ width: 360, height: 360, bottom: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(184,151,106,0.07) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full flex flex-col items-center relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="section-header w-full flex flex-col items-center"
        >
          <span className="label">Bismillahirrahmanirrahim</span>
          <div className="hr-thin" style={{ marginBlock: "16px" }} />
          <h2 className="display" style={{ color: "var(--ink)" }}>Kedua Mempelai</h2>
          <p
            className="mt-4 leading-relaxed text-center"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--ink-muted)",
              fontWeight: 300,
              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
              maxWidth: 480,
            }}
          >
            &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri agar kamu dapat
            beristirahat kepadanya.&rdquo;
            <span className="block mt-1 label text-center" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
              QS. Ar-Rum : 21
            </span>
          </p>
        </motion.div>

        {/* Couple grid */}
        <div className="mt-12 relative w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 items-start">
          <PersonCard
            name={WEDDING.groom.nickname}
            fullName={WEDDING.groom.fullName}
            parentInfo={WEDDING.groom.parentInfo}
            photo={WEDDING.groom.photo}
          />

          {/* Center divider with ampersand — desktop only */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 pointer-events-none z-10">
            <motion.div 
              className="hr-vertical" 
              style={{ height: 40 }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              <span className="script" style={{ fontSize: "2.5rem", color: "var(--blush)", lineHeight: 1 }}>&amp;</span>
            </motion.div>
            <motion.div 
              className="hr-vertical" 
              style={{ height: 40 }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>

          {/* Mobile ampersand */}
          <div className="flex sm:hidden flex-col items-center gap-1 my-2 relative z-10">
            <motion.div className="hr-thin w-16" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.5 }} />
            <motion.span 
              className="script" 
              style={{ fontSize: "2.25rem", color: "var(--blush)" }}
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.7, type: "spring" }}
            >
              &amp;
            </motion.span>
            <motion.div className="hr-thin w-16" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.5 }} />
          </div>

          <PersonCard
            name={WEDDING.bride.nickname}
            fullName={WEDDING.bride.fullName}
            parentInfo={WEDDING.bride.parentInfo}
            photo={WEDDING.bride.photo}
          />
        </div>
      </motion.div>
    </section>
  );
}
