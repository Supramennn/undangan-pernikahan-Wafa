# 💍 Template Undangan Pernikahan Digital Elegan & Modern

Template undangan pernikahan digital interaktif berbasis **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Supabase (Realtime Database)** dengan desain bergaya *Luxury Warm Ivory & Gold*.

---

## ✨ Fitur Utama

- 💌 **Sampul / Cover Interaktif**: Efek buka amplop (*envelope opening*) dilengkapi animasi partikel romantis.
- 👤 **Personalisasi Nama Tamu**: Mendukung query parameter `?to=Nama-Tamu` (otomatis tampil di cover & form RSVP).
- 🛠️ **Admin Link Generator**: Halaman internal `/admin/generate-link` untuk mempermudah mempelai membuat link personal & format pesan WhatsApp dalam 1-klik.
- ⏳ **Countdown Timer**: Kotak hitung mundur hari, jam, menit, dan detik yang responsif.
- 📅 **Jadwal Acara (Akad & Resepsi)**: Integrasi tombol Google Maps & embed peta langsung sesuai lokasi gedung/rumah.
- 🖼️ **Galeri Kenangan**: Masonry grid foto momen pre-wedding dengan modal lightbox interaktif.
- ✍️ **Form RSVP & Buku Tamu (Realtime)**: Konfirmasi kehadiran dan ucapan doa yang terhubung langsung ke Supabase.
- 💳 **Amplop Digital / Hadiah**: Fitur salin nomor rekening bank (*BCA, Mandiri, dll.*) dan alamat pengiriman kado fisik.
- 🎵 **Background Music Player**: Pemutar musik romantis otomatis saat undangan dibuka (*dengan tombol play/pause floating*).
- 📱 **Mobile-First & Ultra Responsive**: Dioptimalkan untuk semua ukuran layar (HP 360px–414px, Tablet, Desktop).

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 ke atas
- Akun [Supabase](https://supabase.com/) (Gratis)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu buka file `.env.local` dan isi kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 4. Setup Database Supabase
Buka **SQL Editor** pada Dashboard Supabase Anda, lalu jalankan script SQL berikut untuk membuat tabel `rsvp` beserta policy keamanannya:

```sql
-- 1. Buat tabel RSVP
CREATE TABLE public.rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir')),
  guest_count INTEGER DEFAULT 0,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

-- 3. Beri izin kirim RSVP (INSERT) untuk tamu publik
CREATE POLICY "Allow public insert into rsvp" 
ON public.rsvp 
FOR INSERT 
TO anon, authenticated, public 
WITH CHECK (true);

-- 4. Beri izin baca ucapan buku tamu (SELECT) untuk tamu publik
CREATE POLICY "Allow public select from rsvp" 
ON public.rsvp 
FOR SELECT 
TO anon, authenticated, public 
USING (true);

-- 5. Aktifkan Realtime Replication untuk tabel rsvp
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp;
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## ⚙️ Kustomisasi Data Pernikahan

Cukup edit file **`lib/config.ts`**. Semua informasi pada website otomatis terupdate:

- **Nama Mempelai & Orang Tua**: Ganti `groom` dan `bride`.
- **Tanggal & Waktu Acara**: Ganti `dateTime` dan `endTime` pada `akad` dan `resepsi`.
- **Lokasi & Google Maps**: Ganti `venue`, `address`, `mapsUrl`, dan `mapEmbedUrl`.
- **Rekening Bank**: Ganti data array `bankAccounts`.
- **Musik Latar**: Letakkan file audio MP3 di `public/music/` dan sesuaikan jalurnya di `music`.
- **Foto & Galeri**:
  - Foto sampul: `public/couple/cover.webp`
  - Foto mempelai pria: `public/couple/groom.webp`
  - Foto mempelai wanita: `public/couple/bride.webp`
  - Foto galeri: `public/gallery/photo-1.webp` hingga `photo-5.webp`

---

## 🌐 Cara Deploy ke Vercel

1. Push project Anda ke repository **GitHub / GitLab / Bitbucket**.
2. Buka **[Vercel Dashboard](https://vercel.com/)** dan klik **"Add New Project"**.
3. Import repository project Anda.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **"Deploy"**. Selesai! 🎉

---

## 🛠️ Generator Link Undangan

Untuk membuat link undangan perorangan dengan format nama rapi, akses:
```
https://domain-anda.vercel.app/admin/generate-link
```
- Contoh link personal: `https://domain-anda.vercel.app/?to=Bapak-Ahmad-Fauzi`
- Nama tamu akan otomatis tampil di cover (*Kepada Yth. Bapak Ahmad Fauzi*) dan otomatis terisi di form RSVP.

---

## 📄 Lisensi
Dibuat untuk kebutuhan undangan pernikahan digital. Bebas digunakan dan dimodifikasi.
