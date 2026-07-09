import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import RegulationForm from "../../RegulationForm";
import { updateVillageRegulation, RegulationInput } from "../../actions";

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

  async function handleSubmit(data: RegulationInput) {
    "use server";
    try {
      await updateVillageRegulation(id, data);
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Gagal memperbarui peraturan desa." };
    }
  }

  return <RegulationForm initialData={regulation} onSubmit={handleSubmit} />;
}
