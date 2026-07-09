import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdminSession } from "./auth-session";
import { ActionType } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionState<T> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};

type SafeActionParams<Schema extends z.ZodTypeAny, ReturnData> = {
  permissions: string[];
  schema?: Schema;
  actionType: ActionType;
  entityName: string;
  handler: (
    validatedData: z.infer<Schema>,
    adminId: string,
    formData: FormData
  ) => Promise<{ entityId: string; details?: string; data?: ReturnData }>;
};

/**
 * Standard wrapper for Server Actions.
 * - Handles RBAC (permissions).
 * - Handles Zod validation (optional).
 * - Automatically records Audit Trail upon success.
 * - Centralizes Error Handling and returns a unified state `{ success, errors, message, data }`.
 */
export async function createSafeAction<Schema extends z.ZodTypeAny, ReturnData>(
  formData: FormData,
  {
    permissions,
    schema,
    actionType,
    entityName,
    handler,
  }: SafeActionParams<Schema, ReturnData>
): Promise<ActionState<ReturnData>> {
  try {
    // 1. Verifikasi RBAC & Session
    const session = await requireAdminSession(permissions);
    
    // 2. Extract Data dari FormData
    let validatedData: any = {};
    if (schema) {
      const dataObj = Object.fromEntries(formData.entries());
      const validationResult = schema.safeParse(dataObj);
      
      if (!validationResult.success) {
        return {
          success: false,
          errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
          message: "Validasi gagal. Periksa kembali input Anda.",
        };
      }
      validatedData = validationResult.data;
    } else {
      validatedData = Object.fromEntries(formData.entries());
    }

    // 3. Eksekusi Handler Inti
    const result = await handler(validatedData, session.user.id, formData);

    // 4. Rekam Jejak Audit secara Asinkron (tidak memblokir UI)
    prisma.auditLog
      .create({
        data: {
          action: actionType,
          entity: entityName,
          entityId: result.entityId,
          details: result.details || "Operasi berhasil",
          adminId: session.user.id,
        },
      })
      .catch((err) => {
        console.error("Gagal menyimpan Audit Log:", err);
      });

    // 5. Kembalikan Respon Sukses
    return {
      success: true,
      data: result.data,
      message: "Operasi berhasil disimpan.",
    };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    
    console.error(`[Server Action Error - ${entityName}]`, error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan pada server.",
    };
  }
}

