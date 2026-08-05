import { PrismaClient } from '@prisma/client';

// Singleton do PrismaClient — evita múltiplas conexões em desenvolvimento
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export default prisma;
