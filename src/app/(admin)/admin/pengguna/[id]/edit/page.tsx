import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import { requireAdminSession } from "@/lib/auth-session";

export default async function EditAdminPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdminSession(["ALL_ACCESS"]);
  const { id } = await params;
  
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    notFound();
  }

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" }
  });

  return <EditForm admin={admin} roles={roles} />;
}
