import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { Handshake } from "lucide-react";
import CollaboratorsManager from "./CollaboratorsManager";

export const dynamic = "force-dynamic";

export default async function AdminKolaboratorPage() {
  // Verifikasi sesi dan hak akses admin
  await requireAdminSession(["MANAGE_COLLABORATORS"]);

  // Ambil semua data kolaborator diurutkan berdasarkan urutan (order)
  const collaborators = await prisma.collaborator.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase flex items-center gap-3">
            <Handshake className="w-8 h-8 text-turquoise" />
            Kelola Kolaborator
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Kelola data instansi, mitra, dan lembaga kolaborator yang ditampilkan di halaman beranda publik.
          </p>
        </div>
      </div>

      {/* Main Manager Component */}
      <CollaboratorsManager initialCollaborators={collaborators} />
    </div>
  );
}
