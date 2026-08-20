import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://neondb_owner:npg_eQh9xUcJXZ7L@ep-spring-glade-azym3lkf.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
