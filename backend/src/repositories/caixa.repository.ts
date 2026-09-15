import prisma from '../lib/prisma';
import { CreateCaixaDto, UpdateCaixaDto } from '../dtos/caixa.dto';

export const caixaRepository = {
  findAll() {
    return prisma.caixa.findMany({
      include: {
        gaveta: { include: { freezer: { include: { sala: true } } } },
        _count: { select: { amostras: true } },
      },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findByGaveta(gavetaId: number) {
    return prisma.caixa.findMany({
      where: { gavetaId },
      include: { _count: { select: { amostras: true } } },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findById(id: number) {
    return prisma.caixa.findUnique({
      where: { id },
      include: {
        gaveta: { include: { freezer: { include: { sala: true } } } },
        amostras: { orderBy: { posicao: 'asc' } },
      },
    });
  },

  create(data: CreateCaixaDto) {
    return prisma.caixa.create({ data });
  },

  update(id: number, data: UpdateCaixaDto) {
    return prisma.caixa.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.caixa.delete({ where: { id } });
  },
};
