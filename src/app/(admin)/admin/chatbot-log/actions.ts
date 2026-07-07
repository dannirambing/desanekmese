"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteChatLog(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.permissions.includes("ALL_ACCESS")) {
      throw new Error("Unauthorized access. Only ALL_ACCESS can delete logs.");
    }

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
