import { getHeroSettings } from "@/lib/queries";
import { requireAdminSession } from "@/lib/auth-session";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const settings = await getHeroSettings();

  return <HeroForm initialSettings={settings} />;
}
