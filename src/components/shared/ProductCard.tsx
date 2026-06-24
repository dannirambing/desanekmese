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
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/umkm/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-50">
          <Image
            src={imageUrl || DEFAULT_PRODUCT_IMAGE}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-navy uppercase tracking-wider rounded-full shadow-sm">
            UMKM Lokal
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/umkm/${slug}`} className="flex-1">
          <h3 className="text-xl font-bold text-navy mb-1 hover:text-turquoise transition-colors">
            {name}
          </h3>
          <p className="text-sm text-stone-500 mb-2">{ownerName}</p>
          <p className="text-gold font-semibold mb-4">{formatRupiah(price)}</p>
        </Link>

        <Button
          asChild
          className="w-full bg-stone-900 hover:bg-turquoise text-white rounded-xl"
        >
          <a href={orderUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            {getOrderLabel(orderType)}
          </a>
        </Button>
      </div>
    </div>
  );
}
