import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Inicializa el Prisma Client
const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
