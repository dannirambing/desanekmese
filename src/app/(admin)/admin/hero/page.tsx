import { getHeroSettings } from "@/lib/queries";
import { requireAdminSession } from "@/lib/auth-session";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  await requireAdminSession(["MANAGE_HERO"]);
  const settings = await getHeroSettings();

  return <HeroForm initialSettings={settings} />;
}
