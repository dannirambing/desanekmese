import Link from "next/link";
import { ArrowRight, Megaphone, Newspaper, Calendar } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NewsCard from "./NewsCard";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";
import type { NewsArticle, Announcement, MediaFile } from "@prisma/client";

interface NewsArticleWithMedia extends NewsArticle {
  media: MediaFile[];
}

interface NewsAndAnnouncementSectionProps {
  newsArticles: NewsArticleWithMedia[];
  announcements: Announcement[];
}

export default function NewsAndAnnouncementSection({
  newsArticles = [],
  announcements = [],
}: NewsAndAnnouncementSectionProps) {
  // Ambil maksimal 4 berita terbaru untuk halaman depan
  const latestNews = newsArticles.slice(0, 4);
  // Ambil maksimal 6 pengumuman terbaru
  const latestAnnouncements = announcements.slice(0, 6);

  // Jika kedua data kosong, jangan render seksi ini
  if (latestNews.length === 0 && latestAnnouncements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24 bg-slate-50/50 relative overflow-hidden border-y border-slate-100">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="Kabar & Informasi"
          title="Berita & Pengumuman Desa"
          alignment="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-12">
          {/* Kolom Kiri: Berita Terbaru (Lebar 8 Kolom) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <div className="p-2 bg-turquoise/10 text-turquoise rounded-xl">
                  <Newspaper size={20} className="stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-navy uppercase tracking-wider">
                  Berita Terbaru
                </h3>
              </div>

              {latestNews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400">Belum ada berita yang dipublikasikan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.map((article) => {
                    const imageUrl =
                      article.media.length > 0
                        ? article.media[0].url
                        : "/placeholder-image.jpg";
                    const displayDate = article.publishedAt ?? article.createdAt;

                    return (
                      <NewsCard
                        key={article.id}
                        title={article.title}
                        summary={article.summary}
                        image={imageUrl}
                        slug={article.slug}
                        date={displayDate}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {latestNews.length > 0 && (
              <div className="mt-8">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 text-turquoise hover:text-navy font-bold uppercase text-xs tracking-widest transition-all hover:gap-3 group"
                >
                  Lihat Semua Berita
                  <ArrowRight
                    size={14}
                    className="stroke-[3] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Pengumuman Resmi (Lebar 4 Kolom) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Megaphone size={20} className="stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-navy uppercase tracking-wider">
                  Pengumuman Resmi
                </h3>
              </div>

              {latestAnnouncements.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400">Belum ada pengumuman resmi.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {latestAnnouncements.map((announcement) => (
                    <Link
                      key={announcement.id}
                      href={`/pengumuman/${announcement.slug}`}
                      className="group block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                        <Calendar size={13} className="text-amber-500" />
                        <time dateTime={toIsoDateTime(announcement.createdAt)}>
                          {formatIndonesianDate(announcement.createdAt)}
                        </time>
                      </div>
                      <h4 className="text-base font-extrabold text-[#0f172a] group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-light">
                        {announcement.content}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {latestAnnouncements.length > 0 && (
              <div className="mt-8">
                <Link
                  href="/pengumuman"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-navy font-bold uppercase text-xs tracking-widest transition-all hover:gap-3 group"
                >
                  Lihat Semua Pengumuman
                  <ArrowRight
                    size={14}
                    className="stroke-[3] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
