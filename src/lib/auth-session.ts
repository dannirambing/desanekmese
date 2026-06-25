import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export function getAdminSession() {
  return getServerSession(authOptions);
}

export async function requireAdminSession(allowedRoles?: string[]) {
  const session = await getAdminSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error("Unauthorized: Tidak memiliki hak akses yang memadai.");
  }

  return session;
}
