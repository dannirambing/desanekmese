import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import RegulationForm from "../../RegulationForm";
import { updateVillageRegulation } from "../../actions";

interface EditPeraturanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPeraturanPage({ params }: EditPeraturanPageProps) {
  await requireAdminSession(["MANAGE_PERATURAN"]);
  const { id } = await params;

  const regulation = await prisma.villageRegulation.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    },
  });

  if (!regulation) {
    notFound();
  }

  const updateAction = updateVillageRegulation.bind(null, id);

  return <RegulationForm initialData={regulation} onSubmit={updateAction} />;
}
