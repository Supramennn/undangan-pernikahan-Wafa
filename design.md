# Design Spec — Undangan Digital (Next.js + TypeScript)

**Referensi fitur:** ourmoment.link (`mita-afif`)
**Target stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase
**Tujuan dokumen:** instruksi build untuk tim/dev, bukan analisa — siap dieksekusi.

---

## 1. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/SSG untuk SEO & performa, dynamic route per pasangan |
| Bahasa | TypeScript | Type-safety untuk config & data model |
| Styling | Tailwind CSS | Konsisten dengan template Nexus Diji sebelumnya |
| Animasi | Framer Motion (+ `MotionConfig reducedMotion="user"`) | Wajib untuk hormati preferensi accessibility |
| Backend/DB | Supabase (Postgres + RLS + Realtime) | RSVP & ucapan real-time tanpa server terpisah |
| Hosting | Vercel | Auto-deploy, edge-ready |
| Dev command | `next dev --webpack` | Hindari cache bug Turbopack (sudah pernah kejadian) |

---

## 2. Struktur Folder

```
src/
├── app/
│   └── [slug]/                    # dynamic route per pasangan, contoh: /mita-afif
│       ├── page.tsx                # server component, fetch config + searchParams (?to=)
│       └── opengraph-image.tsx     # OG image dinamis (nama pasangan + foto)
├── components/
│   ├── sections/
│   │   ├── CoverScreen.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CoupleSection.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── EventSchedule.tsx
│   │   ├── GallerySection.tsx
│   │   ├── LoveStorySection.tsx
│   │   ├── GiftSection.tsx
│   │   ├── Guestbook.tsx
│   │   └── FooterSection.tsx
│   └── ui/                         # button, copy-button, lightbox, dsb (reusable)
├── config/
│   └── wedding.config.ts           # single source of truth (tanggal, lokasi, nama, dsb)
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── queries.ts              # getWishes, submitRsvp, subscribeRealtime
└── types/
    └── wedding.ts                  # semua interface/type
```

---

## 3. Config — Single Source of Truth

Semua data yang bisa berubah per klien **wajib** lewat `wedding.config.ts`, jangan hardcode di komponen:

```ts
export const weddingConfig = {
  couple: {
    groom: { name: "", fullName: "", parents: "", instagram: "" },
    bride: { name: "", fullName: "", parents: "", instagram: "" },
  },
  event: {
    date: "2026-08-09T09:00:00+07:00",
    akad: { time: "09.00 - 10.00 WIB", location: "", mapsUrl: "" },
    resepsi: { time: "11.00 - 14.00 WIB", location: "", mapsUrl: "" },
  },
  quote: { text: "", source: "QS. Ar-Rum : 21" },
  gallery: string[],           // path ke /public atau Supabase storage
  loveStory: { title: string; content: string }[],
  gift: {
    banks: { bankName: string; accountNumber: string; accountName: string }[],
    address: { recipient: string; fullAddress: string },
  },
  organizer: { instagram: string; whatsappNumbers: string[] },
} as const;
```

> Catatan: dari analisa kompetitor, personalisasi tamu (`?to=abdul`) cukup ditangani via `searchParams` di server component — **tidak perlu tabel tamu terpisah** kecuali mau tracking siapa saja yang buka undangan (opsional, lihat §5).

---

## 4. Breakdown Komponen (urutan render)

| # | Komponen | Behavior |
|---|---|---|
| 1 | `CoverScreen` | Baca `searchParams.to`, tampilkan "Yth, {nama}". Tombol "Buka Undangan" trigger scroll + unlock audio (jika ada musik latar). |
| 2 | `HeroSection` | Judul, tanggal, inisial, quote. Animasi fade-in on mount. |
| 3 | `CoupleSection` | Foto + data dari config, link IG `target="_blank"`. |
| 4 | `CountdownTimer` | `useEffect` + `setInterval` client component, hitung selisih ke `event.date`. **Jangan hardcode venue di sini** (bug lama). |
| 5 | `EventSchedule` | Card Akad & Resepsi, tombol "Google Maps" (`event.akad.mapsUrl`), embed `<iframe>` Google Maps. |
| 6 | `GallerySection` | Grid responsif, `next/image` wajib (optimasi otomatis), lightbox modal saat diklik. |
| 7 | `LoveStorySection` | Timeline vertikal, animasi scroll-reveal (`whileInView`). |
| 8 | `GiftSection` | List rekening, tombol copy pakai `navigator.clipboard.writeText`, feedback toast "Tersalin". |
| 9 | `Guestbook` | Form (nama, ucapan, status kehadiran: Hadir/Tidak Hadir) → submit ke Supabase. List ucapan realtime via Supabase Realtime channel, pagination "Muat lebih banyak". |
| 10 | `FooterSection` | Kontak WO, branding Nexus Diji. |

---

## 5. Data Model (Supabase)

```sql
-- tabel undangan (1 row = 1 pasangan/klien)
create table invitations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- "mita-afif"
  config jsonb not null,               -- bisa simpan snapshot config, atau split ke kolom
  created_at timestamptz default now()
);

-- ucapan & RSVP
create table wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations(id) on delete cascade,
  guest_name text not null,
  message text not null,
  attendance text check (attendance in ('hadir', 'tidak_hadir')) not null,
  created_at timestamptz default now()
);

-- opsional: tracking siapa yang buka undangan (kalau mau fitur ini)
create table guest_visits (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations(id) on delete cascade,
  guest_slug text not null,           -- dari ?to=
  visited_at timestamptz default now()
);
```

- **RLS**: `wishes` → insert public (anon) diperbolehkan, tapi select dibatasi per `invitation_id` sesuai slug halaman.
- **Realtime**: subscribe ke tabel `wishes` filter `invitation_id=eq.<id>` supaya ucapan baru muncul tanpa refresh.

---

## 6. Fitur yang WAJIB Ada (mengacu ke kompetitor + best practice)

- [ ] Personalisasi nama tamu via query param `?to=`
- [ ] Countdown timer real-time
- [ ] RSVP (Hadir/Tidak Hadir) tersimpan ke Supabase
- [ ] Guestbook realtime (ucapan langsung muncul, tanpa reload — ini nilai jual dibanding kompetitor yang masih pakai komentar WordPress statis)
- [ ] Copy-to-clipboard nomor rekening & alamat
- [ ] Google Maps embed + tombol buka di app Maps
- [ ] Galeri foto dengan lightbox
- [ ] `MotionConfig reducedMotion="user"` di root layout (accessibility)
- [ ] Meta `robots: noindex, nofollow` per halaman undangan (privasi tamu)
- [ ] OG image dinamis per pasangan (untuk preview link WA)

## 7. Fitur Opsional (nice-to-have, bisa fase 2)

- [ ] Musik latar dengan tombol mute/unmute
- [ ] Live guest counter ("X orang sudah konfirmasi hadir")
- [ ] Export data RSVP ke Excel/CSV untuk klien
- [ ] Integrasi payment gateway Doku untuk pembelian paket undangan (menggantikan model manual kode unik seperti kompetitor)

---

## 8. Urutan Pengerjaan (Checklist Implementasi)

1. Setup project: `create-next-app` (TS + Tailwind), install Framer Motion & Supabase client.
2. Buat `wedding.config.ts` + `types/wedding.ts`.
3. Setup Supabase project + jalankan schema di §5 + RLS policy.
4. Build komponen statis dulu (§4) pakai data dummy dari config.
5. Sambungkan `Guestbook` ke Supabase (insert + realtime subscribe).
6. Tambahkan animasi Framer Motion per section (scroll-reveal + reduced motion).
7. Optimasi gambar (`next/image`, format `.webp`).
8. Setup dynamic OG image + meta noindex.
9. Test build production (`next build`) + cek ESLint clean.
10. Deploy ke Vercel, test di mobile (WA in-app browser jadi prioritas testing).

---

## 9. Non-Functional Requirements

- **Performance**: Lighthouse mobile score target ≥ 90 (kompetitor WordPress+Elementor biasanya berat karena banyak plugin — ini jadi diferensiasi).
- **Accessibility**: hormati `prefers-reduced-motion`, kontras warna cukup, alt text di semua gambar.
- **Mobile-first**: 90%+ traffic undangan dibuka dari WhatsApp in-app browser di HP.
- **Privasi**: semua halaman undangan `noindex`, data tamu tidak publik di luar halaman spesifik mereka.
