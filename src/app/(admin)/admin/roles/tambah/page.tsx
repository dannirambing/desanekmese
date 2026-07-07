import { requireAdminSession } from "@/lib/auth-session";
import RoleForm from "../RoleForm";

export default async function TambahRolePage() {
  await requireAdminSession(["ALL_ACCESS"]);
  return <RoleForm />;
}
