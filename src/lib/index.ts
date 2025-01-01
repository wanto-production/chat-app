// place files you want to import through the `$lib` alias in this folder.

export function diffForHumans(date: string): string {
    const now = new Date(); // Current local time
    const past = new Date(date); // Date input (assumed UTC)

    // Validasi jika input tanggal tidak valid
    if (isNaN(past.getTime())) {
        throw new Error("Invalid date format");
    }

    // Mengonversi waktu ke zona waktu lokal (misalnya UTC+7)
    const timezoneOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const pastLocal = new Date(past.getTime() + timezoneOffset); // Konversi ke waktu lokal

    const diff = now.getTime() - pastLocal.getTime(); // Difference in milliseconds
    const isFuture = diff < 0; // Jika waktu di masa depan
    const absDiff = Math.abs(diff); // Ambil nilai absolut selisih

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    // Tentukan string hasil berdasarkan interval waktu
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
    return `${years} year${years !== 1 ? "s" : ""} ${isFuture ? "from now" : "ago"}`;
}
