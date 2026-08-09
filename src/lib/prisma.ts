import { PrismaClient } from "@prisma/client";

const PRISMA_SCHEMA_VERSION = "v9-collaborators";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion?: string;
};

function createPrismaClient() {
  return new PrismaClient();
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;

  if (
    cached &&
    globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
  ) {
    return cached;
  }

  if (cached) {
    cached.$disconnect().catch(() => {});
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  return client;
}

export const prisma = getPrismaClient();
