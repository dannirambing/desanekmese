import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { updateTourismPlace } from "@/app/(admin)/admin/wisata/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import TourismForm from "@/components/admin/TourismForm";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";

export default async function EditWisataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_WISATA"]);

  const { id } = await params;
  const [place, categories] = await Promise.all([
    prisma.tourismPlace.findUnique({
      where: { id },
      include: { 
        media: { take: 1 },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
    }),
    prisma.category.findMany(),
  ]);

  if (!place) notFound();

  const currentMedia = place.media[0] ?? null;
  const updatePlaceWithId = updateTourismPlace.bind(null, place.id);

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/wisata"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Data Destinasi
        </h1>

        <TourismForm
          initialData={{
            id: place.id,
            name: place.name,
            location: place.location,
            description: place.description,
            categoryId: place.categoryId,
            status: place.status,
            facilities: place.facilities.join(", "),
            mapUrl: place.mapUrl,
            openHours: place.openHours || "",
          }}
          initialImage={currentMedia}
          categories={categories}
        />

        <AuditTrailInfo
          createdBy={place.createdBy}
          updatedBy={place.updatedBy}
          createdAt={place.createdAt}
          updatedAt={place.updatedAt}
        />
      </div>
    </div>
  );
}
