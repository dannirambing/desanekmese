import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Desa Nekmese",
  description: "Syarat dan ketentuan penggunaan portal resmi Desa Nekmese.",
};

export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-stone-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-stone-900/50 to-stone-50" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white border border-white/20">
            Informasi Hukum
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed max-w-xl mx-auto">
            Aturan main, panduan penggunaan, serta batasan tanggung jawab yang berlaku bagi seluruh pengunjung portal resmi Pemerintah Desa Nekmese.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200/60">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Pembaruan Terakhir</p>
                <p className="text-sm font-bold text-stone-700">29 Juni 2026</p>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-stone-600 text-sm md:text-base leading-relaxed space-y-6">
              <p>
                Selamat datang di Portal Resmi Pemerintah Desa Nekmese. Dengan mengakses, menjelajahi, atau menggunakan portal ini, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan berikut. Jika Anda tidak menyetujui aturan ini, silakan hentikan penggunaan portal kami.
              </p>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">1. Penggunaan Layanan Portal</h3>
                <p className="mb-3">
                  Portal ini disediakan untuk memberikan pelayanan publik digital, transparansi anggaran, pengumuman resmi, profil kebudayaan, UMKM desa, dan pariwisata lokal. Pengunjung diwajibkan:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Menggunakan portal ini hanya untuk tujuan yang sah, legal, dan mematuhi peraturan perundang-undangan di Republik Indonesia.</li>
                  <li>Tidak menyalahgunakan, meretas, merusak integritas keamanan, atau mencoba melakukan spamming data terhadap sistem portal.</li>
                  <li>Memberikan data kependudukan atau kontak yang valid, jujur, dan akurat saat mengajukan permohonan pelayanan publik digital.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">2. Hak Kekayaan Intelektual</h3>
                <p>
                  Semua konten yang tersedia di portal ini, termasuk teks, desain visual, logo, grafis, ikon, data anggaran, dan foto (kecuali aset media yang berhak cipta pihak eksternal), adalah kekayaan intelektual milik Pemerintah Desa Nekmese dan dilindungi oleh undang-undang. Penggunaan ulang, penyalinan, atau penyebarluasan konten untuk kepentingan non-komersial diizinkan dengan syarat mencantumkan sumber asli portal resmi Desa Nekmese secara jelas.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">3. Akurasi & Ketersediaan Informasi</h3>
                <p>
                  Pemerintah Desa Nekmese berupaya maksimal untuk menyajikan data yang akurat, mutakhir, dan relevan di portal ini (misalnya data APBDesa, profil kependudukan, pengumuman). Namun, kami tidak menjamin secara mutlak bahwa seluruh informasi di dalamnya bebas dari kesalahan ketik atau keterlambatan pembaruan teknis. Kami berhak melakukan perubahan konten kapan saja tanpa pemberitahuan terlebih dahulu.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">4. Sektor UMKM & Pariwisata</h3>
                <p>
                  Portal ini turut menampilkan profil UMKM desa (seperti Tenun Buna, Kopi Arabika) dan destinasi pariwisata (seperti Air Terjun Oenesu, Fatu Braun). Transaksi atau kunjungan fisik yang terjadi antara pengunjung portal dengan pemilik UMKM desa maupun pengelola pariwisata adalah transaksi independen di luar kendali hukum portal pemerintah desa. Pemerintah desa tidak bertanggung jawab atas sengketa komersial pribadi yang mungkin timbul.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">5. Batasan Tanggung Jawab</h3>
                <p>
                  Pemerintah Desa Nekmese tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial yang disebabkan oleh ketidakmampuan teknis dalam mengakses portal, gangguan server di luar kendali kami, maupun kerusakan perangkat akibat malware saat menjelajahi internet secara umum.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">6. Perubahan Syarat & Ketentuan</h3>
                <p>
                  Kami berhak untuk mengubah, memodifikasi, menambah, atau menghapus bagian dari Syarat dan Ketentuan ini sewaktu-waktu. Perubahan tersebut akan langsung berlaku saat diposting di halaman ini. Keterlibatan Anda yang berkelanjutan setelah adanya pembaruan berarti Anda menyetujui perubahan tersebut.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
