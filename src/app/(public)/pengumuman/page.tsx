import type { Metadata } from "next";
import { getPublishedAnnouncements } from "@/lib/queries";
import SectionTitle from "@/components/shared/SectionTitle";
import AnnouncementListWithFilter from "./AnnouncementListWithFilter";

export const metadata: Metadata = {
  title: "Pengumuman Resmi | Desa Nekmese",
  description: "Daftar pengumuman resmi, berita darurat, dan informasi penting dari Pemerintah Desa Nekmese.",
};

export const revalidate = 60;

export default async function PengumumanPage() {
  const announcements = await getPublishedAnnouncements();

  // Serialisasi objek Date agar aman dilewatkan ke Client Component
  const serializedAnnouncements = announcements.map((ann) => ({
    ...ann,
    createdAt: new Date(ann.createdAt).toISOString(),
    updatedAt: new Date(ann.updatedAt).toISOString(),
  }));

  const waMessage = encodeURIComponent(
    "Halo Admin Desa Nekmese, saya ingin menanyakan perihal pengumuman resmi yang baru diterbitkan."
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-stone-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiLE6uuy7QOXxRGYaFpEt6MkAvwsNb7Z2DnJLV')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-stone-900/60 to-stone-900" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-400 border border-amber-400/30 shadow-sm">
            Papan Informasi
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4 uppercase">
            Pengumuman
          </h1>
          <p className="text-base md:text-xl text-stone-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
            Dapatkan berita resmi, maklumat, agenda kegiatan, dan regulasi terbaru dari Pemerintah Desa Nekmese.
          </p>
        </div>
      </section>

      {/* Announcements List Section */}
      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <SectionTitle subtitle="Warta Desa" title="Informasi & Pemberitahuan" />
          </div>

          <AnnouncementListWithFilter announcements={serializedAnnouncements} />

          {/* Contact Box */}
          <div className="mt-20 bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden border border-stone-800 max-w-4xl mx-auto">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-stone-500/15 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight text-amber-400">
                Butuh Informasi Lebih Lanjut?
              </h3>
              <p className="mb-8 text-stone-300 text-sm md:text-base leading-relaxed">
                Hubungi sekretariat kantor desa melalui WhatsApp untuk menanyakan regulasi, surat edaran, atau pengumuman tertentu.
              </p>
              <a
                href={`https://wa.me/6282135850132?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 text-stone-950 px-8 py-3.5 rounded-full font-black tracking-wide hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 text-sm md:text-base"
              >
                Hubungi Kantor Desa
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
