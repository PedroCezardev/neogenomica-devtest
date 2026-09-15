import prisma from '../lib/prisma';
import { CreateGavetaDto, UpdateGavetaDto } from '../dtos/gaveta.dto';

export const gavetaRepository = {
  findAll() {
    return prisma.gaveta.findMany({
      include: {
        freezer: { include: { sala: true } },
        _count: { select: { caixas: true } },
      },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findByFreezer(freezerId: number) {
    return prisma.gaveta.findMany({
      where: { freezerId },
      include: { _count: { select: { caixas: true } } },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findById(id: number) {
    return prisma.gaveta.findUnique({
      where: { id },
      include: {
        freezer: { include: { sala: true } },
        caixas: {
          include: { _count: { select: { amostras: true } } },
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
  },

  countCaixas(id: number) {
    return prisma.caixa.count({ where: { gavetaId: id } });
  },

  countGavetas(freezerId: number) {
    return prisma.gaveta.count({ where: { freezerId } });
  },

  create(data: CreateGavetaDto) {
    return prisma.gaveta.create({ data });
  },

  update(id: number, data: UpdateGavetaDto) {
    return prisma.gaveta.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.gaveta.delete({ where: { id } });
  },
};
