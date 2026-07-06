import WaterSourceForm from "@/components/admin/WaterSourceForm";
import { createWaterSource } from "../actions";

export default function CreateWaterSourcePage() {
  return <WaterSourceForm onSubmit={createWaterSource} />;
}
