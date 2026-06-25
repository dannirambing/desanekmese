import { notFound } from "next/navigation";
import Link from "next/link";
import { Megaphone, CalendarDays } from "lucide-react";
import SafeImage from "@/components/shared/SafeImage";
import HeroImageOverlay from "@/components/shared/HeroImageOverlay";
import { getAnnouncementBySlug } from "@/lib/queries";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) {
    return { title: "Pengumuman Tidak Ditemukan | Desa Nekmese" };
  }

  return {
    title: `${announcement.title} | Pengumuman Desa Nekmese`,
    description: announcement.content.slice(0, 160),
  };
}

export default async function PengumumanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement || announcement.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-stone-200">
        {announcement.imageUrl ? (
          <SafeImage
            src={announcement.imageUrl}
            alt={announcement.title}
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 bg-stone-100">
            <Megaphone className="w-16 h-16 text-amber-500/40 mb-2" />
            <span className="text-sm font-semibold tracking-wider uppercase text-stone-400">
              Pengumuman Resmi
            </span>
          </div>
        )}
        <HeroImageOverlay />
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-stone-200/50">
          <div className="flex items-center gap-2 text-sm text-stone-500 font-medium mb-4">
            <CalendarDays size={16} className="text-amber-500" />
            <time dateTime={toIsoDateTime(announcement.createdAt)}>
              {formatIndonesianDate(announcement.createdAt)}
            </time>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-8 leading-tight">
            {announcement.title}
          </h1>

          <div className="text-stone-700 leading-relaxed whitespace-pre-line text-base md:text-lg font-light">
            {announcement.content}
          </div>

          <div className="mt-12 pt-8 border-t border-stone-100">
            <Link
              href="/pengumuman"
              className="inline-flex items-center text-sm font-bold text-amber-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
            >
              ← Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
