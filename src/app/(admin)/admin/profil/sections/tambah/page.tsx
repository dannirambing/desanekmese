import { requireAdminSession } from "@/lib/auth-session";
import SectionForm from "../SectionForm";

export const dynamic = "force-dynamic";

export default async function AddSectionPage() {
  // Verifikasi sesi admin
  await requireAdminSession(["MANAGE_PROFIL"]);

  return <SectionForm />;
}
