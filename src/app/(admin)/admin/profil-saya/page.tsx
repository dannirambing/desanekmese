import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilSayaPage() {
  await requireAdminSession();

  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="w-full">
      <ProfileForm admin={admin} />
    </div>
  );
}
