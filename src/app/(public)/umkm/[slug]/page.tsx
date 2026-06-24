import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUMKMProductBySlug } from "@/lib/queries";
import { formatRupiah } from "@/lib/format-rupiah";
import { DEFAULT_PRODUCT_IMAGE, getOrderLabel } from "@/lib/umkm-order";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getUMKMProductBySlug(slug);

  if (!product) {
    return { title: "Produk Tidak Ditemukan | Desa Nekmese" };
  }

  return {
    title: `${product.name} | UMKM Desa Nekmese`,
    description: product.description.slice(0, 160),
  };
}

export default async function UmkmDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getUMKMProductBySlug(slug);

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="container mx-auto px-6 pt-32 md:pt-40">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke UMKM
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto md:min-h-[480px] bg-stone-100">
              <Image
                src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block w-fit text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                UMKM Lokal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-2">
                {product.name}
              </h1>
              <p className="text-stone-500 mb-4">Oleh {product.ownerName}</p>
              <p className="text-2xl font-bold text-gold mb-6">
                {formatRupiah(product.price)}
              </p>
              <p className="text-stone-600 leading-relaxed mb-8 whitespace-pre-line">
                {product.description}
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-stone-900 hover:bg-turquoise text-white rounded-xl py-6 text-base"
              >
                <a
                  href={product.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} />
                  {getOrderLabel(product.orderType)}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
