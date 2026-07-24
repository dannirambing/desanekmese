import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { Link2 } from "lucide-react";
import RelatedLinksManager from "./RelatedLinksManager";

export const dynamic = "force-dynamic";

export default async function AdminLinkTerkaitPage() {
  // Verifikasi sesi dan hak akses admin
  await requireAdminSession(["MANAGE_LINKS"]);

  // Ambil semua data link terkait diurutkan berdasarkan urutan (order)
  const links = await prisma.relatedLink.findMany({
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
            <Link2 className="w-8 h-8 text-turquoise" />
            Link Terkait Footer
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Kelola tautan sistem informasi, sistem pemetaan, atau website luar yang ditampilkan di Footer.
          </p>
        </div>
      </div>

      {/* Main Manager Component */}
      <RelatedLinksManager initialLinks={links} />
    </div>
  );
}
