"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  type?: "arch" | "wave" | "line";
  className?: string;
  fillColor?: string;
  inverted?: boolean;
}

export default function SectionDivider({ 
  type = "line", 
  className = "",
  fillColor = "var(--ivory-warm)",
  inverted = false
}: SectionDividerProps) {
  if (type === "line") {
    return (
      <div className={`relative flex justify-center py-10 w-full overflow-hidden ${className}`}>
        <motion.div
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-40 w-[150px] sm:w-[250px]"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.4, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute -top-[3px] text-[var(--gold-light)] opacity-60"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ fontSize: "10px" }}
        >
          ✦
        </motion.div>
      </div>
    );
  }

  // Soft Arch divider
  return (
    <div className={`relative w-full overflow-hidden leading-none z-10 ${className}`} style={{ transform: inverted ? "rotate(180deg)" : "none" }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px] sm:h-[90px]"
        style={{ fill: fillColor }}
      >
        <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}
