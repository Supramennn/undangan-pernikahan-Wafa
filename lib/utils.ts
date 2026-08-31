/**
 * Utility functions for wedding invitation
 */

/**
 * Memformat dan membersihkan parameter nama tamu dari query parameter (?to=...).
 * 
 * Aturan:
 * 1. Mengganti tanda strip (-) dan plus (+) menjadi spasi: "Bapak-Ahmad-Fauzi" -> "Bapak Ahmad Fauzi"
 * 2. Decode URI component (%20, %2B, dll)
 * 3. Sanitasi dari tag HTML / script injection
 * 4. Normalisasi spasi berlebih
 * 5. Fallback ke "Tamu Undangan" jika kosong atau tidak valid
 * 
 * @param rawParam - Nilai query parameter `to` dari URL
 * @returns Nama tamu yang sudah diformat dan aman untuk ditampilkan
 */
export function formatGuestName(rawParam?: string | string[]): string {
  if (!rawParam) return "Tamu Undangan";

  const raw = Array.isArray(rawParam) ? rawParam[0] : rawParam;
  if (!raw || typeof raw !== "string") return "Tamu Undangan";

  try {
    // 1. Decode URI Component
    const decoded = decodeURIComponent(raw);

    // 2. Ganti tanda strip (-) dan tanda plus (+) menjadi spasi
    const withSpaces = decoded.replace(/[-+]/g, " ");

    // 3. Sanitasi dasar untuk mencegah tag HTML / XSS
    const sanitized = withSpaces
      .replace(/<[^>]*>?/gm, "")
      .replace(/[<>'"`;(){}[\]]/g, "")
      .trim();

    // 4. Normalisasi spasi ganda menjadi single space
    const cleaned = sanitized.replace(/\s+/g, " ");

    // 5. Batasi panjang maksimal (misal 50 karakter) agar tidak merusak layout
    if (cleaned.length > 50) {
      return cleaned.slice(0, 50).trim() + "...";
    }

    return cleaned || "Tamu Undangan";
  } catch {
    return "Tamu Undangan";
  }
}

/**
 * Mengubah nama tamu menjadi format query string URL dengan pemisah tanda strip (-).
 * Contoh: "Bapak Ahmad Fauzi" -> "Bapak-Ahmad-Fauzi"
 * 
 * @param name - Nama tamu mentah dari input
 * @returns String yang aman untuk query parameter URL
 */
export function generateGuestSlug(name: string): string {
  if (!name || typeof name !== "string") return "";
  return encodeURIComponent(name.trim().replace(/\s+/g, "-"));
}
