import { getVillageProfile } from "@/lib/queries";
import { requireAdminSession } from "@/lib/auth-session";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  // Verifikasi otentikasi admin
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  
  // Ambil data profil desa saat ini
  const profile = await getVillageProfile();

  return <ProfileForm initialProfile={profile} />;
}
