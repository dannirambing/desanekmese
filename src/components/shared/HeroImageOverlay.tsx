/**
 * Overlay untuk hero gambar agar teks/navbar tetap terbaca di atas foto terang.
 */
export default function HeroImageOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </>
  );
}
