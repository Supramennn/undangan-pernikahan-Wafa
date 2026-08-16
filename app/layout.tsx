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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
