import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import DestinationCard from "@/components/shared/DestinationCard";
import { getPublishedDestinations } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Destinasi Wisata | Desa Nekmese",
  description:
    "Jelajahi keindahan alam, budaya, dan destinasi unggulan yang ada di Desa Nekmese.",
};

export const revalidate = 60;

export default async function WisataPage() {
  const allDestinations = await getPublishedDestinations();

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900/40" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block text-gold-400 font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white border border-white/20">
            Pesona Nekmese
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Destinasi Wisata
          </h1>
          <p className="text-base md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
            Temukan kepingan surga yang tersembunyi di Desa Nekmese. Dari pesona
            alam yang asri hingga kekayaan budaya yang otentik.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <SectionTitle
              subtitle="Eksplorasi Sekarang"
              title="Semua Destinasi Kami"
            />
          </div>

          {allDestinations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-lg">
                Belum ada destinasi wisata yang dipublikasikan saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {allDestinations.map((dest) => {
                const imageUrl =
                  dest.media.length > 0
                    ? dest.media[0].url
                    : "/placeholder-image.jpg";

                return (
                  <div
                    key={dest.id}
                    className="transition-transform duration-300 hover:-translate-y-2"
                  >
                    <DestinationCard
                      title={dest.name}
                      location={dest.location}
                      image={imageUrl}
                      slug={dest.slug}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-20 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
                Ingin Merencanakan Kunjungan?
              </h3>
              <p className="mb-8 text-blue-100 text-sm md:text-base opacity-90 leading-relaxed">
                Hubungi pengelola desa wisata kami untuk informasi paket tour,
                penginapan (homestay), dan pemandu lokal yang siap menemani
                perjalanan Anda.
              </p>
              <button className="bg-white text-blue-700 px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-sm md:text-base">
                Hubungi Pengelola Desa
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
