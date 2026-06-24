import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import NewsCard from "@/components/shared/NewsCard";
import { getPublishedNewsArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Berita Desa | Desa Nekmese",
  description:
    "Informasi terkini seputar kegiatan, program, dan perkembangan Desa Nekmese.",
};

export const revalidate = 60;

export default async function BeritaPage() {
  const articles = await getPublishedNewsArticles();

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-blue-950 overflow-hidden">
        {/* Gambar Background 100% cerah */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop')",
          }}
        />
        
        {/* Overlay Biru Malam (Indigo/Navy) yang lebih hangat, bukan abu-abu */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-950/80 via-blue-900/50 to-indigo-950/80" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-teal-300 border border-teal-300/30 shadow-sm">
            Informasi Terkini
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Berita Desa
          </h1>
          <p className="text-base md:text-xl text-indigo-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
            Ikuti perkembangan terbaru seputar kegiatan, program pembangunan,
            dan kehidupan masyarakat Desa Nekmese.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-50/30 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <SectionTitle subtitle="Update Terbaru" title="Berita & Kegiatan" />
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-blue-100 shadow-sm">
              <p className="text-indigo-900/40 font-medium text-lg">
                Belum ada berita yang dipublikasikan saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {articles.map((article) => {
                const imageUrl =
                  article.media.length > 0
                    ? article.media[0].url
                    : "/placeholder-image.jpg";
                const displayDate = article.publishedAt ?? article.createdAt;

                return (
                  <div
                    key={article.id}
                    className="transition-transform duration-300 hover:-translate-y-2"
                  >
                    <NewsCard
                      title={article.title}
                      summary={article.summary}
                      image={imageUrl}
                      slug={article.slug}
                      date={displayDate}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Box dengan gradien warm navy & indigo */}
          <div className="mt-20 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden border border-indigo-800">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight drop-shadow-sm">
                Punya Informasi Menarik?
              </h3>
              <p className="mb-8 text-indigo-100 text-sm md:text-base leading-relaxed">
                Bagikan cerita, kegiatan warga, atau aspirasi Anda untuk memajukan Desa Nekmese bersama-sama.
              </p>
              <button className="bg-teal-400 text-blue-950 px-8 py-3.5 rounded-full font-black tracking-wide hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-400/20 transition-all duration-300 text-sm md:text-base">
                Hubungi Admin Desa
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}