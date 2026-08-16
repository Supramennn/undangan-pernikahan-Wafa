"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING } from "@/lib/config";

export default function MusicPlayer() {
  const [playing,   setPlaying]   = useState(false);
  const [ready,     setReady]     = useState(false);
  const [visible,   setVisible]   = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Show player after hero is unlocked (wait for first user interaction)
  useEffect(() => {
    // Show button immediately — auto-play blocked by browser anyway
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play when invitation is opened
  useEffect(() => {
    function handleInvitationOpened() {
      const audio = audioRef.current;
      if (audio && !playing) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
    window.addEventListener("invitation-opened", handleInvitationOpened);
    return () => window.removeEventListener("invitation-opened", handleInvitationOpened);
  }, [playing]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={WEDDING.music.src}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {}}
        aria-hidden="true"
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed z-50"
            style={{
              bottom: "calc(24px + env(safe-area-inset-bottom))",
              right:  "20px",
            }}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle glow behind button when playing */}
            <AnimatePresence>
              {playing && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(201,144,143,0.2), transparent 70%)",
                    filter: "blur(12px)",
                    transform: "scale(1.5)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            <motion.button
              onClick={toggle}
              className="relative flex items-center gap-2.5 group"
              style={{
                background: "rgba(251,248,244,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(184,151,106,0.2)",
                borderRadius: "100px",
                padding: "10px 18px 10px 10px",
                boxShadow: "0 4px 24px rgba(44,36,32,0.1), 0 1px 0 rgba(255,255,255,0.8) inset",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-label={playing ? "Pause musik" : "Play musik"}
            >
              {/* Vinyl disc / play icon */}
              <motion.div
                className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--ink), var(--ink-soft))",
                  boxShadow: "0 2px 8px rgba(44,36,32,0.2)",
                }}
                animate={{ rotate: playing ? 360 : 0 }}
                transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }}
              >
                {/* Vinyl rings */}
                <div className="absolute inset-[5px] rounded-full" style={{ background: "var(--ink-soft)" }} />
                <div className="absolute inset-[9px] rounded-full" style={{ background: "rgba(251,248,244,0.08)" }} />
                <div className="absolute inset-[11px] rounded-full" style={{ background: "rgba(251,248,244,0.12)" }} />
                {/* Center dot */}
                <div className="absolute inset-[14px] rounded-full" style={{ background: "var(--gold-light)", opacity: 0.9 }} />

                {/* Note overlay when paused */}
                <AnimatePresence>
                  {!playing && (
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center text-sm"
                      style={{ color: "rgba(212,184,150,0.9)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ♫
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Song info */}
              <div className="text-left leading-tight">
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    lineHeight: 1.2,
                  }}
                >
                  {WEDDING.music.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    fontWeight: 300,
                    color: "var(--ink-muted)",
                    lineHeight: 1.2,
                    marginTop: 2,
                  }}
                >
                  {WEDDING.music.artist}
                </p>
              </div>

              {/* Sound waves / pause bars */}
              <div className="flex items-center gap-[3px] ml-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="block w-[2.5px] rounded-full"
                    style={{
                      background: playing
                        ? "linear-gradient(to top, var(--blush), var(--gold-light))"
                        : "var(--blush-light)",
                      opacity: playing ? 1 : 0.35,
                    }}
                    animate={playing ? {
                      height: ["4px", "12px", "6px", "14px", "4px"],
                    } : { height: "4px" }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
