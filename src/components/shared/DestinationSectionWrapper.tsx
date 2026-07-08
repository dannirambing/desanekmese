import DestinationSection from "./DestinationSection";
import { getFeaturedDestinations, getDestinationStats } from "@/lib/queries";

export default async function DestinationSectionWrapper() {
  const [destinations, stats] = await Promise.all([
    getFeaturedDestinations(),
    getDestinationStats(),
  ]);

  return <DestinationSection destinations={destinations} stats={stats} />;
}
