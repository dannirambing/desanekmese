import CultureSection from "./CultureSection";
import { getPublishedCultureItems } from "@/lib/queries";

export default async function CultureSectionWrapper() {
  const cultureItems = await getPublishedCultureItems();
  return <CultureSection cultureItems={cultureItems} />;
}
