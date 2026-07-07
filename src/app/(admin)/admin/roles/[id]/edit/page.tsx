import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RoleForm from "../../RoleForm";
import { requireAdminSession } from "@/lib/auth-session";

export default async function EditRolePage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdminSession(["ALL_ACCESS"]);
  const { id } = await params;
  
  const role = await prisma.role.findUnique({
    where: { id },
  });

  if (!role) {
    notFound();
  }

  return <RoleForm role={role} />;
}
