import { getVillageProfile } from "@/lib/queries";
import { requireAdminSession } from "@/lib/auth-session";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  // Verifikasi otentikasi admin
  await requireAdminSession(["MANAGE_PROFIL"]);
  
  // Ambil data profil desa saat ini
  const profile = await getVillageProfile();

  return <ProfileForm initialProfile={profile} />;
}
