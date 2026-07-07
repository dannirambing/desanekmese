import { requireAdminSession } from "@/lib/auth-session";
import RegulationForm from "../RegulationForm";
import { createVillageRegulation } from "../actions";

export default async function TambahPeraturanPage() {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  async function handleSubmit(data: any) {
    "use server";
    try {
      await createVillageRegulation(data);
      return { success: true };
    } catch (err: any) {
      return { error: err.message || "Gagal menyimpan peraturan desa." };
    }
  }

  return <RegulationForm onSubmit={handleSubmit} />;
}
