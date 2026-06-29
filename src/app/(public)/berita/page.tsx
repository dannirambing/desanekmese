import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import { getPublishedNewsArticles } from "@/lib/queries";
import NewsAndBudgetTabs from "./NewsAndBudgetTabs";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Berita Desa | Desa Nekmese",
  description:
    "Informasi terkini seputar kegiatan, program, dan perkembangan Desa Nekmese.",
};

export const revalidate = 60;

export default async function BeritaPage() {
  const articles = await getPublishedNewsArticles();

  // Serialisasi objek Date agar aman dilewatkan ke Client Component
  const serializedArticles = articles.map((article) => ({
    ...article,
    createdAt: new Date(article.createdAt).toISOString(),
    updatedAt: new Date(article.updatedAt).toISOString(),
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
  }));

  // Ambil data anggaran desa dengan detailnya
  const budgets = await prisma.villageBudget.findMany({
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { year: "desc" },
  });

  const serializedBudgets = budgets.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    items: b.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  }));

  // Pesan otomatis saat tombol WhatsApp diklik
  const waMessage = encodeURIComponent(
    "Halo Admin Desa Nekmese, saya memiliki informasi/cerita menarik seputar desa yang ingin saya bagikan."
  );

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-blue-950 overflow-hidden">
        {/* Gambar Background 100% cerah */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D')",
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

          <NewsAndBudgetTabs articles={serializedArticles} budgets={serializedBudgets} />

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

              {/* Tombol yang sudah diubah menjadi link WhatsApp */}
              <a
                href={`https://wa.me/6282135850132?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-400 text-blue-950 px-8 py-3.5 rounded-full font-black tracking-wide hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-400/20 transition-all duration-300 text-sm md:text-base"
              >
                Hubungi Admin Desa
              </a>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}