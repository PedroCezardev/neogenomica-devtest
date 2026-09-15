import prisma from '../lib/prisma';
import { CreateFreezerDto, UpdateFreezerDto } from '../dtos/freezer.dto';

export const freezerRepository = {
  findAll() {
    return prisma.freezer.findMany({
      include: {
        sala: true,
        _count: { select: { gavetas: true } },
      },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findBySala(salaId: number) {
    return prisma.freezer.findMany({
      where: { salaId },
      include: { _count: { select: { gavetas: true } } },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findById(id: number) {
    return prisma.freezer.findUnique({
      where: { id },
      include: {
        sala: true,
        gavetas: {
          include: { _count: { select: { caixas: true } } },
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
  },

  countGavetas(id: number) {
    return prisma.gaveta.count({ where: { freezerId: id } });
  },

  create(data: CreateFreezerDto) {
    return prisma.freezer.create({ data });
  },

  update(id: number, data: UpdateFreezerDto) {
    return prisma.freezer.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.freezer.delete({ where: { id } });
  },
};
