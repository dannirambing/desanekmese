import { requireAdminSession } from "@/lib/auth-session";
import WaterSourceForm from "@/components/admin/WaterSourceForm";
import { createWaterSource } from "../actions";

export default async function CreateWaterSourcePage() {
  await requireAdminSession(["MANAGE_AIR"]);

  return <WaterSourceForm onSubmit={createWaterSource} />;
}
