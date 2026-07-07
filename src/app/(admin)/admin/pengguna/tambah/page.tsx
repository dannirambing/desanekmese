import { prisma } from "@/lib/prisma";
import TambahForm from "./TambahForm";
import { requireAdminSession } from "@/lib/auth-session";

export default async function TambahPenggunaPage() {
  await requireAdminSession(["ALL_ACCESS"]);

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" }
  });

  return <TambahForm roles={roles} />;
}
