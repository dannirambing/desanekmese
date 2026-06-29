"use client";

import { useState, useTransition } from "react";
import { Edit2, Check, X } from "lucide-react";
import { formatRupiah } from "@/lib/format-rupiah";
import { updateBudgetDetail } from "../actions";
import DeleteDetailButton from "./DeleteDetailButton";

interface BudgetDetail {
  id: string;
  category: string;
  amountBudget: number;
  amountRealization: number;
}

export default function BudgetDetailRow({
  item,
  budgetId,
  type,
}: {
  item: BudgetDetail;
  budgetId: string;
  type: "REVENUE" | "EXPENDITURE";
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formId = `edit-form-${item.id}`;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateBudgetDetail(item.id, budgetId, formData);
        setIsEditing(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal memperbarui pos");
      }
    });
  };

  if (!isEditing) {
    return (
      <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-4 py-3 font-bold text-navy">{item.category}</td>
        <td className="px-4 py-3 text-slate-600">{formatRupiah(item.amountBudget)}</td>
        <td
          className={`px-4 py-3 font-bold ${
            type === "REVENUE" ? "text-teal-600" : "text-indigo-600"
          }`}
        >
          {formatRupiah(item.amountRealization)}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
              title="Ubah Pos"
            >
              <Edit2 size={16} />
            </button>
            <DeleteDetailButton
              detailId={item.id}
              budgetId={budgetId}
              category={item.category}
            />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors bg-blue-50/20">
      <td className="hidden">
        <form id={formId} onSubmit={handleSave} />
      </td>
      <td className="px-4 py-2">
        <input
          form={formId}
          type="text"
          name="category"
          defaultValue={item.category}
          required
          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-turquoise outline-none transition-all"
        />
      </td>
      <td className="px-4 py-2">
        <input
          form={formId}
          type="number"
          name="amountBudget"
          defaultValue={item.amountBudget}
          required
          min={0}
          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-turquoise outline-none transition-all"
        />
      </td>
      <td className="px-4 py-2">
        <input
          form={formId}
          type="number"
          name="amountRealization"
          defaultValue={item.amountRealization}
          required
          min={0}
          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-turquoise outline-none transition-all"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            form={formId}
            type="submit"
            disabled={isPending}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Simpan Perubahan"
          >
            <Check size={16} className={`stroke-[3] ${isPending ? "animate-pulse" : ""}`} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Batal"
          >
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
