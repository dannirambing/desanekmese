import { notFound } from "next/navigation";
import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";
import HeroImageOverlay from "@/components/shared/HeroImageOverlay";
import { getCultureItemBySlug } from "@/lib/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getCultureItemBySlug(slug);

  if (!item) {
    return { title: "Budaya Tidak Ditemukan | Desa Nekmese" };
  }

  return {
    title: `${item.name} | Budaya Desa Nekmese`,
    description: item.summary ?? item.description.slice(0, 160),
  };
}

export default async function BudayaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getCultureItemBySlug(slug);

  if (!item || item.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-stone-200">
        {item.media && item.media.length > 0 ? (
          <SafeImage
            src={item.media[0].url}
            alt={item.name}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            Gambar tidak tersedia
          </div>
        )}
        <HeroImageOverlay />
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full mb-6">
              {item.category.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
              {item.name}
            </h1>
            {item.summary && (
              <p className="text-stone-500 text-lg mb-8 font-medium italic border-l-4 border-amber-400 pl-4 py-1">
                {item.summary}
              </p>
            )}
            <div className="text-stone-600 leading-loose text-base md:text-lg space-y-6 mt-8">
              {item.description.split("\n").map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="font-medium text-stone-700 text-left">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="text-[11px] font-extrabold uppercase text-amber-600 tracking-widest mb-6 flex items-center gap-3">
                <span className="w-5 h-px bg-amber-200 block"></span>
                Kategori Budaya
              </h3>
              <p className="text-sm text-stone-600">{item.category.name}</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-2xl border">
              <h3 className="text-[11px] font-extrabold uppercase text-stone-400 tracking-widest mb-6 flex items-center gap-3">
                <span className="w-5 h-px bg-stone-300 block"></span>
                Jelajahi Lainnya
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Temukan lebih banyak warisan budaya Atoni Meto di halaman budaya
                kami.
              </p>
              <Link
                href="/budaya"
                className="inline-block text-sm font-bold text-amber-800 hover:text-amber-600 transition-colors"
              >
                ← Kembali ke Daftar Budaya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
