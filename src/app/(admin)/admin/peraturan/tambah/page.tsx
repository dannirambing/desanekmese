import { requireAdminSession } from "@/lib/auth-session";
import RegulationForm from "../RegulationForm";
import { createVillageRegulation, RegulationInput } from "../actions";

export default async function TambahPeraturanPage() {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  async function handleSubmit(data: RegulationInput) {
    "use server";
    try {
      await createVillageRegulation(data);
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Gagal menyimpan peraturan desa." };
    }
  }

  return <RegulationForm onSubmit={handleSubmit} />;
}
