import { requireAdminSession } from "@/lib/auth-session";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WaterSourceForm from "@/components/admin/WaterSourceForm";
import { updateWaterSource } from "../../actions";

export default async function EditWaterSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_AIR"]);

  const { id } = await params;
  
  const source = await prisma.waterSource.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    }
  });

  if (!source) {
    notFound();
  }

  const updateAction = updateWaterSource.bind(null, id);

  return <WaterSourceForm initialData={source} onSubmit={updateAction} />;
}
