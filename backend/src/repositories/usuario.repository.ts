import prisma from '../lib/prisma';

export const usuarioRepository = {

  findAll() {
    return prisma.usuario.findMany({
      orderBy: { criadoEm: 'asc' },
      select: { id: true, nome: true, email: true, criadoEm: true }, // nunca expor senha
    });
  },

  findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, criadoEm: true }, // nunca expor senha
    });
  },

  create(data: { nome: string; email: string; senha: string }) {
    return prisma.usuario.create({
      data,
      select: { id: true, nome: true, email: true, criadoEm: true },
    });
  },

};
