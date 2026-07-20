import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import CultureCard from "@/components/shared/CultureCard";
import { getPublishedCultureItems } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Budaya & Kearifan Lokal | Desa Nekmese",
  description:
    "Jelajahi warisan budaya Atoni Meto — tenun tradisional, ritual adat, dan arsitektur leluhur Desa Nekmese.",
};

export const revalidate = 60;

export default async function BudayaPage() {
  const cultureItems = await getPublishedCultureItems();


  const waMessage = encodeURIComponent(
    "Halo Pengelola Desa Nekmese, saya tertarik untuk belajar lebih dalam tentang budaya dan kearifan lokal di desa Anda. Boleh minta informasi lebih lanjut?"
  );

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-stone-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-amber-950/50 to-stone-900/60" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-200 border border-amber-300/30">
            Warisan Atoni Meto
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Budaya & Kearifan Lokal
          </h1>
          <p className="text-base md:text-xl text-stone-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
            Dari helai tenun yang penuh doa hingga ritual adat yang sakral —
            temukan jiwa Desa Nekmese yang hidup dalam setiap tradisi.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <SectionTitle
              subtitle="Eksplorasi Budaya"
              title="Warisan Leluhur Kami"
            />
          </div>

          {cultureItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-stone-400 text-lg">
                Belum ada konten budaya yang dipublikasikan saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {cultureItems.map((item) => {
                const imageUrl =
                  item.media.length > 0
                    ? item.media[0].url
                    : "/placeholder-image.jpg";

                return (
                  <div
                    key={item.id}
                    className="transition-transform duration-300 hover:-translate-y-2"
                  >
                    <CultureCard
                      title={item.name}
                      category={item.category.name}
                      image={imageUrl}
                      slug={item.slug}
                      youtubeUrl={item.youtubeUrl}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-20 bg-gradient-to-r from-amber-900 to-stone-900 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
                Ingin Belajar Lebih Dalam?
              </h3>
              <p className="mb-8 text-amber-100/90 text-sm md:text-base leading-relaxed">
                Kunjungi Desa Nekmese dan rasakan langsung proses menenun,
                upacara adat, serta kehidupan masyarakat Atoni Meto yang autentik.
              </p>

              {/* Tombol yang sudah diubah menjadi link WhatsApp */}
              <a
                href={`https://wa.me/6282135850132?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-400 text-stone-900 px-8 py-3.5 rounded-full font-bold hover:bg-amber-300 hover:shadow-lg transition-all duration-300 text-sm md:text-base"
              >
                Hubungi Pengelola Desa
              </a>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}