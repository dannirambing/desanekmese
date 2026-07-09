import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import SafeImage from "@/components/shared/SafeImage";
import HeroImageOverlay from "@/components/shared/HeroImageOverlay";
import { getNewsArticleBySlug } from "@/lib/queries";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    return { title: "Berita Tidak Ditemukan | Desa Nekmese" };
  }

  return {
    title: `${article.title} | Berita Desa Nekmese`,
    description: article.summary ?? article.content.slice(0, 160),
  };
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const displayDate = article.publishedAt ?? article.createdAt;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-slate-200">
        {article.media && article.media.length > 0 ? (
          <SafeImage
            src={article.media[0].url}
            alt={article.title}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Gambar tidak tersedia
          </div>
        )}
        <HeroImageOverlay />
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-4">
            <CalendarDays size={16} className="text-turquoise" />
            <time dateTime={toIsoDateTime(displayDate)}>
              {formatIndonesianDate(displayDate)}
            </time>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-navy mb-6 leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg text-slate-500 mb-8 font-medium italic border-l-4 border-turquoise pl-4 py-1">
              {article.summary}
            </p>
          )}

          <div className="text-slate-600 leading-relaxed text-base md:text-lg space-y-4">
            {article.content.split("\n").map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="font-medium text-slate-700 text-left">
                  {paragraph}
                </p>
              ) : null
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link
              href="/berita"
              className="inline-flex items-center text-sm font-bold text-turquoise hover:text-navy transition-colors"
            >
              ← Kembali ke Daftar Berita
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
