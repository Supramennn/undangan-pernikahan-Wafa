import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FBF8F4",
};

export const metadata: Metadata = {
  title: "Undangan Pernikahan — Yoga & Saylun",
  description:
    "Dengan penuh sukacita kami mengundang Anda untuk merayakan pernikahan Yoga & Saylun, 21 September 2026.",
  openGraph: {
    title: "Undangan Pernikahan — Yoga & Saylun",
    description: "21 September 2026 · Anda termasuk dalam orang yang kami cintai.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative">
        {/* Global Paper Noise Texture */}
        <div 
          className="pointer-events-none fixed inset-0 z-[9999]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, 
            opacity: 0.04,
            mixBlendMode: "multiply" 
          }} 
          aria-hidden="true" 
        />
        {children}
      </body>
    </html>
  );
}
