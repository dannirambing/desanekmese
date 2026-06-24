import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface DestinationCardProps {
  title: string;
  image: string;
  location: string;
  slug: string;
}

export default function DestinationCard({ title, image, location, slug }: DestinationCardProps) {
  return (
    <Link href={`/destinasi/${slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[4/5] shadow-lg">
      {/* Gambar dengan efek zoom saat di-hover */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay — gelap di bawah untuk teks, sedikit di atas untuk gambar terang */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-black/25 transition-opacity duration-300 group-hover:opacity-95" />

      {/* Konten Teks di bawah */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-2xl font-bold mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{title}</h3>
        <div className="flex items-center gap-2 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <MapPin size={16} className="text-gold" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </Link>
  );
}