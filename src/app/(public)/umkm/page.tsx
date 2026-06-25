import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import { getAllPublishedUMKMProducts } from "@/lib/queries";
import ProductListWithFilter from "./ProductListWithFilter";

export const metadata: Metadata = {
  title: "UMKM Lokal | Desa Nekmese",
  description:
    "Dukung ekonomi lokal Desa Nekmese — karya tangan, hasil bumi, dan produk UMKM autentik dari masyarakat Atoni Meto.",
};

export const revalidate = 60;

export default async function UmkmPage() {
  const products = await getAllPublishedUMKMProducts();

  // Serialisasi objek Date agar aman dilewatkan ke Client Component
  const serializedProducts = products.map((product) => ({
    ...product,
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
  }));

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-emerald-950 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/85 via-stone-900/60 to-emerald-950/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-200 border border-emerald-300/30">
            Dukung Ekonomi Lokal
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Karya Tangan & Hasil Bumi
          </h1>
          <p className="text-base md:text-xl text-stone-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
            Produk autentik buatan tangan warga Desa Nekmese. Setiap pembelian
            langsung memberdayakan pelaku UMKM lokal.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <SectionTitle
              subtitle="Belanja Lokal"
              title="Produk UMKM Nekmese"
            />
          </div>

          <ProductListWithFilter products={serializedProducts} />
        </div>
      </section>
    </>
  );
}
