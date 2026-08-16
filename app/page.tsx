import Navbar         from "@/components/Navbar";
import HeroSection    from "@/components/HeroSection";
import CoupleSection  from "@/components/CoupleSection";
import CountdownTimer from "@/components/CountdownTimer";
import EventSchedule  from "@/components/EventSchedule";
import GallerySection from "@/components/Gallerysection";
import RSVPForm       from "@/components/RSVPForm";
import GiftSection    from "@/components/GiftSection";
import Guestbook      from "@/components/Guestbook";
import MusicPlayer    from "@/components/MusicPlayer";
import { WEDDING }    from "@/lib/config";

export default function Home() {
  return (
    <>
      <Navbar />
      <MusicPlayer />

      <main>
        {/* Hero — amplop interaktif */}
        <HeroSection />

        {/* Mempelai */}
        <CoupleSection />

        {/* Countdown + venue */}
        <CountdownTimer />

        {/* Jadwal acara */}
        <EventSchedule />

        {/* Galeri */}
        <GallerySection />

        {/* RSVP */}
        <RSVPForm />

        {/* Amplop digital */}
        <GiftSection />

        {/* Buku tamu */}
        <Guestbook />
      </main>

      {/* Footer */}
      <footer
        className="relative py-16 text-center flex flex-col items-center gap-5 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, var(--ivory-deep), var(--ivory-warm))",
          borderTop: "1px solid rgba(184,151,106,0.12)",
          paddingBottom: "calc(56px + env(safe-area-inset-bottom))",
        }}
      >
        {/* Decorative background blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              top: "-30%",
              left: "10%",
              background: "radial-gradient(circle, rgba(201,144,143,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 250,
              height: 250,
              bottom: "-20%",
              right: "15%",
              background: "radial-gradient(circle, rgba(184,151,106,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Top ornament */}
        <div className="relative z-10" aria-hidden="true">
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
            <path
              d="M24 0C24 0 20 8 12 12C4 16 0 12 0 12C0 12 8 20 16 20C20 20 24 16 24 16C24 16 28 20 32 20C40 20 48 12 48 12C48 12 44 16 36 12C28 8 24 0 24 0Z"
              fill="var(--gold-light)"
              opacity="0.35"
            />
          </svg>
        </div>

        {/* Names */}
        <p
          className="relative z-10 script"
          style={{ fontSize: "1.8rem", color: "var(--ink-soft)", letterSpacing: "0.02em" }}
        >
          {WEDDING.groom.nickname} &amp; {WEDDING.bride.nickname}
        </p>

        {/* Diamond separator */}
        <div className="relative z-10 hr-diamond">
          <span />
        </div>

        {/* Date */}
        <p
          className="relative z-10 label"
          style={{ color: "var(--ink-muted)", opacity: 0.5, fontSize: "0.6rem", letterSpacing: "0.22em" }}
        >
          21 · September · 2026
        </p>

        {/* Thank you message */}
        <p
          className="relative z-10 mt-2"
          style={{
            fontFamily: "var(--font-italic)",
            fontStyle: "italic",
            color: "var(--ink-muted)",
            fontSize: "0.85rem",
            opacity: 0.5,
          }}
        >
          With Love
        </p>

        {/* Bottom ornament */}
        <div className="relative z-10 mt-2" aria-hidden="true">
          <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
            <path
              d="M16 16C16 16 12 10 8 8C4 6 0 8 0 8C0 8 4 2 10 2C14 2 16 6 16 6C16 6 18 2 22 2C28 2 32 8 32 8C32 8 28 6 24 8C20 10 16 16 16 16Z"
              fill="var(--gold-light)"
              opacity="0.2"
            />
          </svg>
        </div>
      </footer>
    </>
  );
}