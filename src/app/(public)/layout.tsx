import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/shared/Chatbot";
import { getPublishedProfileSections } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const dynamicSections = await getPublishedProfileSections();

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