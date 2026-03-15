import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
//In Next.js, every time you save a file during development the server reloads. Without this, it would create hundreds of database connections and crash. This ensures only one connection exists at a time.