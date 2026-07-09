import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Plus, Scale } from "lucide-react";
import Link from "next/link";
import RegulationList from "./RegulationList";
import { Prisma, RegulationType } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminPeraturanPageProps {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}

export default async function AdminPeraturanPage({
  searchParams,
}: AdminPeraturanPageProps) {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const category = params.category || ""; // Maps to Prisma `type`

  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  const where: Prisma.VillageRegulationWhereInput = {};

  // Server-side filtering by category
  if (category && Object.values(RegulationType).includes(category as RegulationType)) {
    where.type = category as RegulationType;
  }

  // Server-side search
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { number: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const totalItems = await prisma.villageRegulation.count({ where });

  const regulations = await prisma.villageRegulation.findMany({
    where,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    skip,
    take: itemsPerPage,
  });

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase flex items-center gap-3">
            <Scale className="w-8 h-8 text-turquoise" />
            Peraturan Desa
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Kelola arsip peraturan, keputusan kepala desa, dan ketetapan resmi desa.
          </p>
        </div>
        <div>
          <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10 h-auto">
            <Link href="/admin/peraturan/tambah">
              <Plus className="w-4 h-4 mr-2 stroke-[3]" />
              Tambah Peraturan
            </Link>
          </Button>
        </div>
      </div>

      {/* List Component */}
      <RegulationList
        regulations={regulations}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
      />
    </div>
  );
}
