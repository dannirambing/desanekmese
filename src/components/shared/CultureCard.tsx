import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play } from "lucide-react";

interface CultureCardProps {
  title: string;
  image: string;
  category: string;
  slug: string;
  youtubeUrl?: string | null;
}

export default function CultureCard({
  title,
  image,
  category,
  slug,
  youtubeUrl,
}: CultureCardProps) {
  return (
    <Link
      href={`/budaya/${slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] shadow-lg"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {youtubeUrl && (
        <div className="absolute top-4 right-4 bg-stone-900/80 text-amber-400 p-2.5 rounded-full shadow-lg z-10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center border border-white/10" title="Tersedia video dokumentasi">
          <Play size={14} className="fill-current ml-0.5" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/95 via-stone-900/55 to-black/25 transition-opacity duration-300 group-hover:opacity-95" />

      <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-0 md:translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-2xl font-bold mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{title}</h3>
        <div className="flex items-center gap-2 text-white/80 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-sm">{category}</span>
        </div>
      </div>
    </Link>
  );
}
