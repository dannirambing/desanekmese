import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/shared/Chatbot";
import { getPublishedProfileSections } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const rawSections = await getPublishedProfileSections();
  
  // Sanitize to plain serializable objects for Client Components to prevent hydration mismatch (e.g. Date serialization issues)
  const dynamicSections = rawSections.map((sec) => ({
    id: sec.id,
    title: sec.title,
    items: sec.items.map((item) => ({
      id: item.id,
      title: item.title,
    })),
  }));

  return (
    <>
      <Navbar dynamicSections={dynamicSections} />
      <main className="min-h-screen">
        {children}
      </main>
      <Chatbot />
      <Footer />
    </>
  );
}