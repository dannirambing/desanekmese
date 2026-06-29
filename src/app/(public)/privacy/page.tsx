import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Desa Nekmese",
  description: "Kebijakan privasi portal resmi Desa Nekmese. Kami berkomitmen untuk melindungi data pribadi warga dan pengunjung kami.",
};

export default function PrivacyPage() {
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
            Kebijakan Privasi
          </h1>
          <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed max-w-xl mx-auto">
            Komitmen kami dalam menjaga kerahasiaan, melindungi privasi, dan mengamankan data pribadi warga serta pengunjung portal resmi Desa Nekmese.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200/60">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
              <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Pembaruan Terakhir</p>
                <p className="text-sm font-bold text-stone-700">29 Juni 2026</p>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-stone-600 text-sm md:text-base leading-relaxed space-y-6">
              <p>
                Selamat datang di Portal Resmi Pemerintah Desa Nekmese. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda bagikan saat mengakses atau menggunakan layanan portal kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan menjaga informasi Anda.
              </p>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">1. Informasi Yang Kami Kumpulkan</h3>
                <p className="mb-3">
                  Kami dapat mengumpulkan informasi pribadi Anda dalam beberapa cara ketika Anda berinteraksi dengan portal kami, termasuk:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Informasi Identitas Pribadi:</strong> Nama lengkap, alamat email, alamat rumah, nomor telepon, dan data administratif kependudukan yang Anda berikan secara sukarela saat mengisi formulir layanan atau permohonan informasi.</li>
                  <li><strong>Informasi Aktivitas Portal:</strong> Data log browser, alamat IP, halaman yang dikunjungi, waktu dan durasi kunjungan, serta preferensi navigasi Anda guna meningkatkan kualitas layanan kami.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">2. Penggunaan Informasi</h3>
                <p className="mb-3">
                  Pemerintah Desa Nekmese menggunakan informasi yang dikumpulkan untuk tujuan berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Menyediakan, mengelola, dan mengoptimalkan layanan publik digital kepada warga desa.</li>
                  <li>Memproses aspirasi, pengaduan kependudukan, pengajuan administrasi surat, serta memberikan tanggapan yang relevan.</li>
                  <li>Mengirimkan pengumuman penting mengenai kegiatan desa, kebijakan terbaru, serta informasi penting lainnya.</li>
                  <li>Menganalisis performa portal untuk evaluasi internal dan pengembangan teknologi sistem secara berkala.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">3. Perlindungan & Keamanan Data</h3>
                <p>
                  Kami menerapkan langkah-langkah keamanan teknis dan administratif yang dirancang untuk melindungi data pribadi Anda dari akses tidak sah, pengungkapan, perubahan, atau penghancuran yang tidak semestinya. Data Anda disimpan di server yang aman dengan otentikasi ketat dan hanya dapat diakses oleh staf pemerintah desa yang berwenang.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">4. Pembagian Informasi dengan Pihak Ketiga</h3>
                <p>
                  Pemerintah Desa Nekmese berkomitmen untuk **tidak pernah** menjual, menyewakan, membagikan, atau memperdagangkan data pribadi Anda kepada pihak ketiga untuk kepentingan komersial. Data Anda hanya dapat dibagikan kepada instansi pemerintah daerah atau hukum yang berwenang jika diwajibkan oleh undang-undang atau peraturan hukum formal yang berlaku.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">5. Hak Anda atas Data Pribadi</h3>
                <p>
                  Anda memiliki hak penuh untuk meminta akses, koreksi, pembaruan, atau penghapusan data pribadi Anda yang tersimpan di sistem kami. Anda dapat menghubungi pengelola portal melalui kontak resmi kantor desa yang tersedia untuk mengajukan permohonan tersebut.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-3">6. Hubungi Kami</h3>
                <p>
                  Jika Anda memiliki pertanyaan, saran, atau keluhan terkait Kebijakan Privasi ini, silakan menghubungi kami di:
                </p>
                <div className="mt-3 bg-stone-50 border border-stone-200/60 rounded-2xl p-5 text-stone-700 text-xs md:text-sm font-semibold space-y-2">
                  <p>🏛️ Kantor Pemerintah Desa Nekmese</p>
                  <p>📍 Kecamatan Amarasi Selatan, Kabupaten Kupang, Nusa Tenggara Timur</p>
                  <p>✉️ Email: info@nekmese.desa.id</p>
                </div>
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
