import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_PENGUMUMAN"]);

  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) notFound();

  return (
    <AnnouncementForm
      initialData={{
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        status: announcement.status,
      }}
      initialImage={announcement.imageUrl}
    />
  );
}
