import { requireAdminSession } from "@/lib/auth-session";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default async function TambahPengumumanPage() {
  await requireAdminSession(["MANAGE_PENGUMUMAN"]);

  return <AnnouncementForm />;
}
