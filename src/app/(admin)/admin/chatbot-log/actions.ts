"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function deleteChatLog(id: string) {
  try {
    await requireAdminSession(["ALL_ACCESS"]);

    await prisma.chatCache.delete({
      where: { id },
    });

    revalidatePath("/admin/chatbot-log");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete chat log:", error);
    return { success: false, error: "Gagal menghapus log chatbot." };
  }
}
