import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import SectionForm from "../SectionForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditSectionPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditSectionPage({ params }: EditSectionPageProps) {
  // Verifikasi sesi admin
  await requireAdminSession(["MANAGE_PROFIL"]);

  // Di Next.js App Router terbaru, params bertipe Promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Ambil data section beserta itemnya
  const section = await prisma.profileSection.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!section) {
    notFound();
  }

  // Petakan ke bentuk input yang diharapkan oleh SectionForm
  const initialData = {
    id: section.id,
    title: section.title,
    description: section.description,
    order: section.order,
    status: section.status as "DRAFT" | "PUBLISHED",
    items: section.items.map((item) => ({
      id: item.id,
      title: item.title,
      contentType: item.contentType as "TEXT" | "IMAGE" | "YOUTUBE",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      youtubeUrl: item.youtubeUrl || "",
      order: item.order,
    }))
  };

  return <SectionForm initialData={initialData} />;
}
