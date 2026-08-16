"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GlobalParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render a few large, highly blurred orbs that slowly float around
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-30"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: 400,
          maxHeight: 400,
          background: "radial-gradient(circle, var(--gold-pale) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: ["-10vw", "10vw", "-5vw", "-10vw"],
          y: ["-10vh", "20vh", "5vh", "-10vh"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-20"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: 500,
          maxHeight: 500,
          background: "radial-gradient(circle, var(--blush-pale) 0%, transparent 60%)",
          filter: "blur(60px)",
          right: "-10vw",
          top: "30vh",
        }}
        animate={{
          x: ["10vw", "-10vw", "5vw", "10vw"],
          y: ["10vh", "-15vh", "20vh", "10vh"],
          scale: [0.8, 1.1, 1, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-20"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 600,
          maxHeight: 600,
          background: "radial-gradient(circle, var(--ivory-deep) 0%, transparent 60%)",
          filter: "blur(50px)",
          left: "10vw",
          bottom: "-20vh",
        }}
        animate={{
          x: ["-5vw", "15vw", "-10vw", "-5vw"],
          y: ["10vh", "-10vh", "-5vh", "10vh"],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
