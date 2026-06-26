import Link from "next/link";

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.64 5.11 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

import { getRecentAnnouncements } from "@/lib/queries";
import { formatIndonesianDate } from "@/lib/format-date";

// Menu disinkronkan dengan Navbar
const menuItems = [
  { name: "Beranda", href: "/" },
  { name: "Profil Desa", href: "/profil" },
  { name: "Wisata", href: "/wisata" },
  { name: "Budaya", href: "/budaya" },
  { name: "UMKM", href: "/umkm" },
  { name: "Berita", href: "/berita" },
  { name: "Pengumuman", href: "/pengumuman" },
];

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const recentAnnouncements = await getRecentAnnouncements();

  return (
    <footer className="bg-stone-950 text-white pt-20 pb-10 border-t-4 border-turquoise">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Kolom 1: Profil & Filosofi */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-extrabold tracking-tighter text-white">
                Desa <span className="text-turquoise">Nekmese</span>
              </span>
            </Link>
            <p className="text-stone-400 font-light leading-relaxed mb-6">
              "Nekaf Mese, Atoni Meto Nao Fatu Nao Oe". Harmoni alam dan budaya di jantung Timor. Temukan kedamaian dan keindahan yang tak terlupakan bersama kami.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-turquoise hover:text-white transition-all">
                <InstagramIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-turquoise hover:text-white transition-all">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-turquoise hover:text-white transition-all">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat (Diambil dari array menuItems) */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Jelajahi</h4>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-stone-400 hover:text-turquoise transition-colors flex items-center gap-2 group">
                    <ChevronRightIcon />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Pengumuman Terbaru */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Pengumuman</h4>
            <div className="space-y-4">
              {recentAnnouncements.length === 0 ? (
                <p className="text-stone-500 text-sm italic">Belum ada pengumuman.</p>
              ) : (
                <div className="space-y-3.5">
                  {recentAnnouncements.map((ann) => (
                    <Link
                      key={ann.id}
                      href={`/pengumuman/${ann.slug}`}
                      className="group block text-sm leading-normal transition-all"
                    >
                      <span className="block text-[11px] text-stone-500 font-semibold tracking-wider uppercase mb-0.5 group-hover:text-turquoise/80 transition-colors">
                        {formatIndonesianDate(ann.createdAt)}
                      </span>
                      <span className="text-stone-300 group-hover:text-white group-hover:underline line-clamp-2 leading-relaxed transition-colors font-medium">
                        {ann.title}
                      </span>
                    </Link>
                  ))}
                  
                  <div className="pt-2 border-t border-stone-900">
                    <Link
                      href="/pengumuman"
                      className="text-turquoise hover:text-white transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 group/btn"
                    >
                      Semua Pengumuman
                      <span className="inline-block transform transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-4 text-stone-400 font-light">
              <li className="flex items-start gap-3">
                <span className="text-turquoise shrink-0 mt-1"><MapPinIcon /></span>
                <span>Kantor Desa Nekmese,<br />Kecamatan Amarasi Selatan,<br />Kabupaten Kupang, NTT.</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <span className="text-turquoise shrink-0"><PhoneIcon /></span>
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <span className="text-turquoise shrink-0"><MailIcon /></span>
                <span>info@nekmese.desa.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500 font-light">
          <p>© {currentYear} Danni Rambing. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}