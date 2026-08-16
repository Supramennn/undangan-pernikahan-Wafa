"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Mempelai", href: "#mempelai" },
  { label: "Jadwal",   href: "#jadwal"   },
  { label: "Galeri",   href: "#galeri"   },
  { label: "RSVP",     href: "#rsvp"     },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeHash,  setActiveHash]  = useState("");

  // Frosted-glass trigger on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight active section
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveHash("#" + e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleLink(href: string) {
    setMenuOpen(false);
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Brand letter animation
  const brandVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-400 overflow-hidden"
        style={{
          background: scrolled
            ? "rgba(251,248,244,0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(184,151,106,0.12)" : "1px solid transparent",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* Subtle gradient shimmer on scroll */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[-1] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(184,151,106,0.05), transparent)",
                transform: "skewX(-20deg)",
                width: "200%",
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          )}
        </AnimatePresence>

        <nav
          className="flex items-center justify-between relative z-10"
          style={{ paddingInline: "20px", paddingBlock: "14px", maxWidth: 960, margin: "0 auto" }}
        >
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="script flex items-center gap-1"
            style={{ fontSize: "1.1rem", color: "var(--ink-soft)", letterSpacing: "0.01em" }}
            aria-label="Kembali ke atas"
          >
            <motion.span initial="hidden" animate="visible" variants={brandVariants} transition={{ delay: 0.1 }}>P</motion.span>
            <motion.span initial="hidden" animate="visible" variants={brandVariants} transition={{ delay: 0.2 }}>&amp;</motion.span>
            <motion.span initial="hidden" animate="visible" variants={brandVariants} transition={{ delay: 0.3 }}>S</motion.span>
          </button>

          {/* Desktop links */}
          <ul className="hidden sm:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                <button
                  onClick={() => handleLink(link.href)}
                  className="label transition-all duration-200"
                  style={{
                    color: activeHash === link.href ? "var(--blush)" : "var(--ink-muted)",
                    letterSpacing: "0.18em",
                    fontSize: "0.62rem",
                  }}
                >
                  {link.label}
                </button>
                {activeHash === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--blush)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 relative z-50"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block h-px w-5 rounded-full"
              style={{ background: menuOpen ? "var(--ink)" : "var(--ink-soft)" }}
              animate={menuOpen ? { rotate: 45, y: 6, scale: 1.1 } : { rotate: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            />
            <motion.span
              className="block h-px w-5 rounded-full"
              style={{ background: "var(--ink-soft)" }}
              animate={menuOpen ? { opacity: 0, scale: 0.5, x: 10 } : { opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            />
            <motion.span
              className="block h-px w-5 rounded-full"
              style={{ background: menuOpen ? "var(--ink)" : "var(--ink-soft)" }}
              animate={menuOpen ? { rotate: -45, y: -6, scale: 1.1 } : { rotate: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center sm:hidden overflow-hidden"
            style={{ background: "rgba(251,248,244,0.97)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%", transition: { delay: 0.2, duration: 0.3, ease: "easeInOut" } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Drawer side decorative element */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-2 pointer-events-none" 
              style={{ background: "linear-gradient(to bottom, var(--blush-pale), var(--gold-pale))" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />

            <nav>
              <ul className="flex flex-col items-center gap-9">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 + 0.1, duration: 0.4, ease: "easeOut" }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleLink(link.href)}
                      className="display relative z-10"
                      style={{
                        fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
                        color: activeHash === link.href ? "var(--blush)" : "var(--ink)",
                      }}
                    >
                      {link.label}
                    </button>
                    {activeHash === link.href && (
                      <motion.div
                        layoutId="activeNavMobile"
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--blush)" }}
                      />
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
