"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="p-4 mb-14 md:mb-4 border-t border-white/10 space-y-2">
      <p className="text-xs text-white/40 font-semibold truncate px-2">
        {session.user.email}
      </p>
      <Button
        type="button"
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/10 font-bold text-sm"
      >
        <LogOut className="w-4 h-4" />
        Keluar
      </Button>
    </div>
  );
}
