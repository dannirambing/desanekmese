import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function EditAdminPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    notFound();
  }

  return <EditForm admin={admin} />;
}
