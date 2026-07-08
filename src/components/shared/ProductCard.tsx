import Image from "next/image";
import Link from "next/link";
import type { OrderChannel } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format-rupiah";
import { DEFAULT_PRODUCT_IMAGE, getOrderLabel } from "@/lib/umkm-order";

export type ProductCardData = {
  name: string;
  slug: string;
  price: number;
  ownerName: string;
  imageUrl?: string | null;
  orderUrl: string;
  orderType: OrderChannel;
};

export default function ProductCard({
  name,
  slug,
  price,
  ownerName,
  imageUrl,
  orderUrl,
  orderType,
}: ProductCardData) {
  return (
    <div className="group relative flex flex-col w-full overflow-hidden rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
      <Link href={`/umkm/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-50">
          <Image
            src={imageUrl || DEFAULT_PRODUCT_IMAGE}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Badge Kategori dengan dot pulse turquoise */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-turquoise animate-pulse" />
            <span className="text-navy text-[10px] font-bold uppercase tracking-widest">
              UMKM Lokal
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/umkm/${slug}`} className="flex-1">
          <h3 className="text-lg md:text-xl font-extrabold text-navy leading-snug mb-1 hover:text-turquoise transition-colors duration-300">
            {name}
          </h3>
          <p className="text-xs text-stone-500 mb-2 font-medium">{ownerName}</p>
          <p className="text-amber-600 font-bold text-base mb-4">{formatRupiah(price)}</p>
        </Link>

        <Button
          asChild
          className="w-full bg-[#0f172a] hover:bg-turquoise text-white rounded-xl py-5 font-bold uppercase text-xs tracking-wider transition-colors duration-300"
        >
          <a href={orderUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} className="mr-1.5" />
            {getOrderLabel(orderType)}
          </a>
        </Button>
      </div>
    </div>
  );
}



