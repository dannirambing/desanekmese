import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";
import type { ProductUMKM } from "@prisma/client";

type UMKMSectionProps = {
  products: ProductUMKM[];
};

export default function UMKMSection({ products }: UMKMSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <SectionTitle
          subtitle="Dukung Ekonomi Lokal"
          title="Karya Tangan & Hasil Bumi"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-8 py-3.5 rounded-full font-semibold uppercase text-sm tracking-widest transition-all hover:gap-3 shadow-lg shadow-navy/10"
          >
            Lihat Semua Produk UMKM
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
