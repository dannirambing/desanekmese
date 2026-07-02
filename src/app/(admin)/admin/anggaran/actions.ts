"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";

// Helper to recalculate parent budget totals
async function recalculateBudgetTotals(budgetId: string) {
  const details = await prisma.budgetDetail.findMany({
    where: { budgetId },
  });

  let totalRevenueBudget = 0;
  let totalRevenueRealization = 0;
  let totalExpenditureBudget = 0;
  let totalExpenditureRealization = 0;

  for (const item of details) {
    if (item.type === "REVENUE") {
      totalRevenueBudget += item.amountBudget;
      totalRevenueRealization += item.amountRealization;
    } else if (item.type === "EXPENDITURE") {
      totalExpenditureBudget += item.amountBudget;
      totalExpenditureRealization += item.amountRealization;
    }
  }

  await prisma.villageBudget.update({
    where: { id: budgetId },
    data: {
      totalRevenueBudget,
      totalRevenueRealization,
      totalExpenditureBudget,
      totalExpenditureRealization,
    },
  });
}

export async function createBudget(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  
  const yearStr = formData.get("year") as string;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 1900 || year > 2100) {
    throw new Error("Tahun anggaran tidak valid");
  }

  const existing = await prisma.villageBudget.findUnique({
    where: { year },
  });

  if (existing) {
    throw new Error(`Anggaran untuk tahun ${year} sudah ada`);
  }

  const budget = await prisma.villageBudget.create({
    data: {
      year,
      totalRevenueBudget: 0,
      totalRevenueRealization: 0,
      totalExpenditureBudget: 0,
      totalExpenditureRealization: 0,
    },
  });

  revalidatePath("/admin/anggaran");
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
  redirect(`/admin/anggaran/${budget.id}`);
}

export async function updateBudgetYear(id: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  
  const yearStr = formData.get("year") as string;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 1900 || year > 2100) {
    throw new Error("Tahun anggaran tidak valid");
  }

  const existing = await prisma.villageBudget.findFirst({
    where: { year, NOT: { id } },
  });

  if (existing) {
    throw new Error(`Anggaran untuk tahun ${year} sudah ada`);
  }

  await prisma.villageBudget.update({
    where: { id },
    data: { year },
  });

  revalidatePath("/admin/anggaran");
  revalidatePath(`/admin/anggaran/${id}`);
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
}

export async function deleteBudget(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  
  const id = formData.get("id") as string;
  
  await prisma.villageBudget.delete({
    where: { id },
  });

  revalidatePath("/admin/anggaran");
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
  redirect("/admin/anggaran");
}

export async function addBudgetDetail(budgetId: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);

  const type = formData.get("type") as "REVENUE" | "EXPENDITURE";
  const category = formData.get("category") as string;
  const amountBudget = parseFloat(formData.get("amountBudget") as string);
  const amountRealization = parseFloat(formData.get("amountRealization") as string);

  if (!category || isNaN(amountBudget) || isNaN(amountRealization)) {
    throw new Error("Input detail anggaran tidak valid");
  }

  await prisma.budgetDetail.create({
    data: {
      budgetId,
      type,
      category,
      amountBudget,
      amountRealization,
    },
  });

  await recalculateBudgetTotals(budgetId);

  revalidatePath(`/admin/anggaran/${budgetId}`);
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
}

export async function deleteBudgetDetail(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);

  const detailId = formData.get("detailId") as string;
  const budgetId = formData.get("budgetId") as string;

  if (!detailId || !budgetId) {
    throw new Error("ID detail atau ID anggaran tidak valid");
  }

  await prisma.budgetDetail.delete({
    where: { id: detailId },
  });

  await recalculateBudgetTotals(budgetId);

  revalidatePath(`/admin/anggaran/${budgetId}`);
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
}

export async function updateBudgetDetail(detailId: string, budgetId: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);

  const category = formData.get("category") as string;
  const amountBudget = parseFloat(formData.get("amountBudget") as string);
  const amountRealization = parseFloat(formData.get("amountRealization") as string);

  if (!category || isNaN(amountBudget) || isNaN(amountRealization)) {
    throw new Error("Input detail anggaran tidak valid");
  }

  await prisma.budgetDetail.update({
    where: { id: detailId },
    data: {
      category,
      amountBudget,
      amountRealization,
    },
  });

  await recalculateBudgetTotals(budgetId);

  revalidatePath(`/admin/anggaran/${budgetId}`);
  revalidatePath("/berita");
  revalidateTag("budgets", "max");
  await clearChatCacheByCategory("ANGGARAN");
}
