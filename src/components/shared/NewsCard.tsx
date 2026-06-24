import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";

interface NewsCardProps {
  title: string;
  image: string;
  summary?: string | null;
  slug: string;
  date: Date | string;
}

export default function NewsCard({
  title,
  image,
  summary,
  slug,
  date,
}: NewsCardProps) {
  return (
    <Link
      href={`/berita/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
          <CalendarDays size={14} className="text-turquoise" />
          <time dateTime={toIsoDateTime(date)}>{formatIndonesianDate(date)}</time>
        </div>
        <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 group-hover:text-turquoise transition-colors">
          {title}
        </h3>
        {summary && (
          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {summary}
          </p>
        )}
        <span className="mt-4 text-sm font-bold text-turquoise uppercase tracking-wide">
          Baca Selengkapnya →
        </span>
      </div>
    </Link>
  );
}
