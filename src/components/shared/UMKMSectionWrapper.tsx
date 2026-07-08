import UMKMSection from "./UMKMSection";
import { getPublishedUMKMProducts, getUMKMStats } from "@/lib/queries";

export default async function UMKMSectionWrapper() {
  const [products, stats] = await Promise.all([
    getPublishedUMKMProducts(),
    getUMKMStats(),
  ]);

  return <UMKMSection products={products} stats={stats} />;
}
