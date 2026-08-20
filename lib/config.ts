// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  💍  KONFIGURASI UNDANGAN PERNIKAHAN
//  Isi semua data di bawah ini sesuai data pernikahan Anda.
//  Hanya file ini yang perlu diedit — semua section otomatis terupdate.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const WEDDING = {
  // ──────────────────────────────────────────────────
  //  SAMPUL (HERO COVER)
  // ──────────────────────────────────────────────────
  /** Foto background layar penuh untuk halaman paling depan */
  heroImage: "/couple/cover.webp",

  // ──────────────────────────────────────────────────
  //  MEMPELAI PRIA
  // ──────────────────────────────────────────────────
  groom: {
    /** Nama panggilan (tampil besar di Hero) */
    nickname: "Yoga",
    /** Nama lengkap */
    fullName: "Prayoga Aenul Wafa",
    /** Nama orang tua — format: "Putra dari Bpk. X & Ibu Y" */
    parentInfo: "Putra dari Alm. Bapak H Abdul Rouf & Ibu Hj Rokhmatillah",
    /**
     * Foto profil mempelai pria.
     * Letakkan file foto Anda di: public/couple/groom.webp
     * (bisa juga .png atau .webp, sesuaikan ekstensinya di sini)
     */
    photo: "/couple/groom.webp",
  },

  // ──────────────────────────────────────────────────
  //  MEMPELAI WANITA
  // ──────────────────────────────────────────────────
  bride: {
    /** Nama panggilan (tampil besar di Hero) */
    nickname: "Saylun",
    /** Nama lengkap */
    fullName: "Saylunnada, S.Ag",
    /** Nama orang tua */
    parentInfo: "Putri dari Bapak Karno & Ibu Siti Khotimah",
    /**
     * Foto profil mempelai wanita.
     * Letakkan file foto Anda di: public/couple/bride.webp
     */
    photo: "/couple/bride.webp",
  },

  // ──────────────────────────────────────────────────
  //  AKAD NIKAH
  // ──────────────────────────────────────────────────
  akad: {
    /** Tanggal & waktu mulai (format ISO 8601 dengan timezone) */
    dateTime:   new Date("2026-09-12T08:00:00+07:00"),
    /** Waktu selesai (untuk Add to Calendar) */
    endTime:    new Date("2026-09-12T10:00:00+07:00"),
    /** Nama gedung / tempat */
    venue:      "Masjid Al-Hikmah",
    /** Alamat lengkap */
    address:    "Jl. Masjid Raya No. 1, Jakarta Selatan",
    /** Link Google Maps */
    mapsUrl:    "https://maps.google.com/?q=-6.2,106.8",
  },

  // ──────────────────────────────────────────────────
  //  RESEPSI
  // ──────────────────────────────────────────────────
  resepsi: {
    dateTime:   new Date("2026-09-21T11:00:00+07:00"),
    endTime:    new Date("2026-09-21T15:00:00+07:00"),
    venue:      "Gedung Serbaguna Harmoni",
    address:    "Jl. Harmoni No. 123, Jakarta Pusat",
    mapsUrl:    "https://maps.google.com/?q=-6.17,106.82",
  },

  // ──────────────────────────────────────────────────
  //  AMPLOP DIGITAL / REKENING BANK
  //  Hapus item jika tidak diperlukan
  // ──────────────────────────────────────────────────
  bankAccounts: [
    {
      bank:      "BCA",
      /** Nomor rekening — akan ada tombol Salin */
      number:    "1234567890",
      holder:    "Prayoga Dwi Saputra",
    },
    {
      bank:      "Mandiri",
      number:    "0987654321",
      holder:    "Saylunada Putri Rahayu",
    },
  ],

  // ──────────────────────────────────────────────────
  //  MUSIK
  //  Letakkan file MP3 di: public/music/perfect.mp3
  //  Download "Perfect – Ed Sheeran" dalam format MP3,
  //  rename menjadi perfect.mp3, lalu taruh di folder tersebut.
  // ──────────────────────────────────────────────────
  music: {
    src:    "/music/Perfect.mp3",
    title:  "Perfect",
    artist: "Ed Sheeran",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Helper: format tanggal ke string Indonesia
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function formatDate(date: Date, opts?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    ...opts,
  });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour:   "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Helper: Generate Google Calendar URL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function toGCalDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function googleCalendarUrl(opts: {
  title: string;
  start: Date;
  end:   Date;
  location: string;
  details?: string;
}) {
  const p = new URLSearchParams({
    action:   "TEMPLATE",
    text:     opts.title,
    dates:    `${toGCalDate(opts.start)}/${toGCalDate(opts.end)}`,
    location: opts.location,
    details:  opts.details ?? "",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
