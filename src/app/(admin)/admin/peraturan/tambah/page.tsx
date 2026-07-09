import { requireAdminSession } from "@/lib/auth-session";
import RegulationForm from "../RegulationForm";
import { createVillageRegulation } from "../actions";

export default async function TambahPeraturanPage() {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  return <RegulationForm onSubmit={createVillageRegulation} />;
}
