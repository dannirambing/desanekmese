import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export function getAdminSession() {
  return getServerSession(authOptions);
}

export async function requireAdminSession(requiredPermissions?: string[]) {
  const session = await getAdminSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPerms = session.user.permissions || [];
    if (userPerms.includes("ALL_ACCESS")) {
      return session; // Super Admin bypass
    }
    const hasPermission = requiredPermissions.some(p => userPerms.includes(p));
    if (!hasPermission) {
      throw new Error("Unauthorized: Tidak memiliki hak akses yang memadai.");
    }
  }

  return session;
}
